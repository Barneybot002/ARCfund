/**
 * Project Storage - Unified Interface
 * ====================================
 * 
 * High-level API that combines:
 * - Encryption (arcium-client.ts)
 * - On-chain storage (solana-client.ts)
 * 
 * This is the main interface for frontend components.
 */

import {
    encryptProjectPitch,
    decryptProjectPitch,
    checkProjectAccess,
    grantProjectAccess,
    revokeProjectAccess,
    getProjectAccessList,
    EncryptionState,
} from './arcium-client';

import {
    createProjectOnChain,
    getProject,
    getAllProjects,
    getProjectsByFounder,
    requestProjectAccess,
    getProjectAccessRequests,
    respondToAccessRequest,
    getAccessRequestStatus,
    CreateProjectParams,
    ProjectWithAccess,
    AccessRequest,
} from './solana-client';

import {
    ProjectOnChain,
    isSimulationMode,
} from './arcium-config';

// Re-export types
export type {
    CreateProjectParams,
    ProjectWithAccess,
    AccessRequest,
    ProjectOnChain,
    EncryptionState,
};

// ============================================================================
// MAIN PROJECT API
// ============================================================================

export interface CreateProjectResult {
    success: boolean;
    project?: ProjectOnChain;
    error?: string;
    txHash?: string;
}

/**
 * Create a new project with optional encryption
 * 
 * This is the main function to use from the Create Project page.
 * It handles both public and private (encrypted) projects.
 */
export async function createProject(
    params: CreateProjectParams,
    founderAddress: string,
    onStateChange?: (state: EncryptionState) => void
): Promise<CreateProjectResult> {
    try {
        let encryptedRef: string | undefined;

        if (params.isPrivate) {
            // Step 1: Encrypt the pitch
            onStateChange?.({ status: 'encrypting', message: 'Encrypting your pitch with Arcium MXE...' });

            const encrypted = await encryptProjectPitch(
                params.pitch,
                founderAddress,
                undefined,
                (state) => {
                    // Forward state but prepend step info
                    onStateChange?.({
                        ...state,
                        message: state.message ? `[1/2] ${state.message}` : undefined,
                    });
                }
            );

            encryptedRef = encrypted.id;

            onStateChange?.({
                status: 'encrypting',
                message: '[2/2] Storing project on Solana...',
                progress: 75,
            });
        } else {
            onStateChange?.({ status: 'encrypting', message: 'Creating project on Solana...' });
        }

        // Step 2: Create project on-chain
        const project = await createProjectOnChain(params, founderAddress, encryptedRef);

        onStateChange?.({ status: 'encrypted', message: 'Project created successfully!' });

        return {
            success: true,
            project,
        };

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        onStateChange?.({ status: 'error', error: message });

        return {
            success: false,
            error: message,
        };
    }
}

/**
 * Get a project with access information
 * 
 * This is the main function to use from the Project Detail page.
 * It checks access and decrypts if needed.
 */
export async function getProjectWithAccess(
    projectId: string,
    userAddress: string,
    onStateChange?: (state: EncryptionState) => void
): Promise<ProjectWithAccess | null> {
    try {
        // Get project data
        const project = await getProject(projectId);
        if (!project) {
            return null;
        }

        // If public, return directly
        if (!project.isPrivate) {
            return {
                ...project,
                hasAccess: true,
                accessRequestStatus: 'none',
            };
        }

        // Check access
        const hasAccess = await checkProjectAccess(projectId, userAddress);

        // Check access request status
        const accessRequest = await getAccessRequestStatus(projectId, userAddress);
        const accessRequestStatus: 'none' | 'pending' | 'approved' | 'rejected' =
            accessRequest?.status || 'none';

        // If has access, decrypt
        if (hasAccess) {
            onStateChange?.({ status: 'decrypting', message: 'Decrypting project pitch...' });

            const decrypted = await decryptProjectPitch(projectId, userAddress);

            onStateChange?.({ status: 'decrypted', message: 'Pitch decrypted!' });

            return {
                ...project,
                hasAccess: true,
                decryptedPitch: decrypted?.pitch,
                accessRequestStatus,
            };
        }

        // No access
        return {
            ...project,
            hasAccess: false,
            accessRequestStatus,
        };

    } catch (error) {
        console.error('Failed to get project:', error);
        return null;
    }
}

/**
 * Get all projects for browsing
 */
export async function browseProjects(
    userAddress?: string
): Promise<ProjectWithAccess[]> {
    const projects = await getAllProjects();

    if (!userAddress) {
        return projects.map(p => ({
            ...p,
            hasAccess: !p.isPrivate,
            accessRequestStatus: 'none' as const,
        }));
    }

    // Check access for each project
    const projectsWithAccess = await Promise.all(
        projects.map(async (project) => {
            if (!project.isPrivate) {
                return {
                    ...project,
                    hasAccess: true,
                    accessRequestStatus: 'none' as const,
                };
            }

            const hasAccess = await checkProjectAccess(project.id, userAddress);
            const accessRequest = await getAccessRequestStatus(project.id, userAddress);

            return {
                ...project,
                hasAccess,
                accessRequestStatus: (accessRequest?.status || 'none') as 'none' | 'pending' | 'approved' | 'rejected',
            };
        })
    );

    return projectsWithAccess;
}

/**
 * Get projects created by the user (founder dashboard)
 */
export async function getMyProjects(founderAddress: string): Promise<ProjectOnChain[]> {
    return getProjectsByFounder(founderAddress);
}

// ============================================================================
// ACCESS MANAGEMENT
// ============================================================================

/**
 * Request access to a private project (investor action)
 */
export async function requestAccess(
    projectId: string,
    investorAddress: string,
    message?: string
): Promise<AccessRequest> {
    return requestProjectAccess(projectId, investorAddress, message);
}

/**
 * Approve an access request (founder action)
 * Also grants decryption permission
 */
export async function approveAccess(
    requestId: string,
    projectId: string,
    investorAddress: string,
    founderAddress: string,
    onStateChange?: (state: EncryptionState) => void
): Promise<boolean> {
    try {
        // Step 1: Update request status
        await respondToAccessRequest(requestId, founderAddress, true);

        // Step 2: Grant encryption access
        await grantProjectAccess(projectId, investorAddress, founderAddress, onStateChange);

        return true;
    } catch (error) {
        console.error('Failed to approve access:', error);
        return false;
    }
}

/**
 * Reject an access request (founder action)
 */
export async function rejectAccess(
    requestId: string,
    founderAddress: string
): Promise<boolean> {
    try {
        await respondToAccessRequest(requestId, founderAddress, false);
        return true;
    } catch (error) {
        console.error('Failed to reject access:', error);
        return false;
    }
}

/**
 * Revoke access from an investor (founder action)
 */
export async function revokeAccess(
    projectId: string,
    investorAddress: string,
    founderAddress: string
): Promise<boolean> {
    return revokeProjectAccess(projectId, investorAddress, founderAddress);
}

/**
 * Get pending access requests for a project (founder view)
 */
export async function getPendingAccessRequests(
    projectId: string,
    founderAddress: string
): Promise<AccessRequest[]> {
    const requests = await getProjectAccessRequests(projectId, founderAddress);
    return requests.filter(r => r.status === 'pending');
}

/**
 * Get all access requests for a project (founder view)
 */
export { getProjectAccessRequests };

/**
 * Get list of investors with access (founder view)
 */
export function getInvestorsWithAccess(projectId: string) {
    return getProjectAccessList(projectId);
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export { isSimulationMode };

/**
 * Get mode indicator for UI
 */
export function getModeIndicator(): { label: string; emoji: string; description: string } {
    if (isSimulationMode()) {
        return {
            label: 'Demo Mode',
            emoji: '🔄',
            description: 'Using simulated encryption for demonstration',
        };
    }
    return {
        label: 'Arcium MXE',
        emoji: '🔐',
        description: 'Real multi-party computation encryption',
    };
}
