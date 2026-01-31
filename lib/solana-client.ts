/**
 * Solana Client for ARCfund
 * =========================
 * 
 * Handles on-chain project storage and access management.
 * 
 * SIMULATION MODE:
 * - Uses localStorage to simulate on-chain storage
 * - Mimics Solana PDAs with deterministic IDs
 * 
 * PRODUCTION MODE:
 * - Uses Anchor client to interact with deployed program
 * - Real PDAs for project and access accounts
 */

import {
    ARCIUM_CONFIG,
    ProjectOnChain,
    isSimulationMode,
    generateProjectId,
} from './arcium-config';

// ============================================================================
// LOCAL STORAGE KEYS (Simulation Mode)
// ============================================================================

const STORAGE_KEYS = {
    PROJECTS: 'arcfund_projects_onchain',
    ACCESS_REQUESTS: 'arcfund_access_requests',
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface AccessRequest {
    id: string;
    projectId: string;
    investorAddress: string;
    founderAddress: string;
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    createdAt: number;
    respondedAt?: number;
}

export interface CreateProjectParams {
    title: string;
    description: string;
    pitch: string;
    fundingGoal: number;
    category: string;
    isPrivate: boolean;
    tags?: string[];
    timeline?: string;
}

export interface ProjectWithAccess extends ProjectOnChain {
    /** Whether current user has access */
    hasAccess: boolean;

    /** Decrypted pitch (if has access and is private) */
    decryptedPitch?: string;

    /** Access request status */
    accessRequestStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

function getStoredProjects(): ProjectOnChain[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return stored ? JSON.parse(stored) : [];
}

function saveStoredProjects(projects: ProjectOnChain[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

function getStoredAccessRequests(): AccessRequest[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.ACCESS_REQUESTS);
    return stored ? JSON.parse(stored) : [];
}

function saveStoredAccessRequests(requests: AccessRequest[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(requests));
}

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================

/**
 * Create a new project on-chain (or in local storage for simulation)
 */
export async function createProjectOnChain(
    params: CreateProjectParams,
    founderAddress: string,
    encryptedRef?: string
): Promise<ProjectOnChain> {
    const projectId = generateProjectId();

    if (isSimulationMode()) {
        console.log('🔄 [Simulation] Creating project on-chain...');

        const project: ProjectOnChain = {
            id: projectId,
            founder: founderAddress,
            title: params.title,
            isPrivate: params.isPrivate,
            encryptedRef: encryptedRef,
            createdAt: Date.now(),
            publicDescription: params.description,
            category: params.category,
            fundingGoal: params.fundingGoal,
        };

        const projects = getStoredProjects();
        projects.push(project);
        saveStoredProjects(projects);

        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log('✅ [Simulation] Project created:', projectId);

        return project;

    } else {
        // TODO: Call Anchor program
        /*
        import { Program, AnchorProvider } from '@coral-xyz/anchor';
        import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
        
        const connection = new Connection(ARCIUM_CONFIG.solanaRpcUrl);
        const wallet = getWallet(); // From Privy
        const provider = new AnchorProvider(connection, wallet, {});
        const program = new Program(IDL, ARCIUM_CONFIG.arcfundProgramId, provider);
        
        const [projectPda] = PublicKey.findProgramAddressSync(
            [Buffer.from('project'), Buffer.from(projectId, 'hex')],
            program.programId
        );
        
        await program.methods
            .createProject(
                Array.from(Buffer.from(projectId, 'hex')),
                params.title,
                params.isPrivate,
                // ... other params
            )
            .accounts({
                founder: wallet.publicKey,
                project: projectPda,
                systemProgram: SystemProgram.programId,
            })
            .rpc();
        */

        throw new Error('Production mode requires Anchor client.');
    }
}

/**
 * Get a project by ID
 */
export async function getProject(projectId: string): Promise<ProjectOnChain | null> {
    if (isSimulationMode()) {
        const projects = getStoredProjects();
        return projects.find(p => p.id === projectId) || null;
    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

/**
 * Get all projects (for browsing)
 */
export async function getAllProjects(): Promise<ProjectOnChain[]> {
    if (isSimulationMode()) {
        return getStoredProjects();
    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

/**
 * Get projects by founder
 */
export async function getProjectsByFounder(founderAddress: string): Promise<ProjectOnChain[]> {
    if (isSimulationMode()) {
        const projects = getStoredProjects();
        return projects.filter(p => p.founder === founderAddress);
    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

/**
 * Get public projects (for discovery)
 */
export async function getPublicProjects(): Promise<ProjectOnChain[]> {
    if (isSimulationMode()) {
        const projects = getStoredProjects();
        return projects.filter(p => !p.isPrivate);
    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

// ============================================================================
// ACCESS REQUEST MANAGEMENT
// ============================================================================

/**
 * Request access to a private project
 */
export async function requestProjectAccess(
    projectId: string,
    investorAddress: string,
    message?: string
): Promise<AccessRequest> {
    if (isSimulationMode()) {
        console.log('🔄 [Simulation] Requesting project access...');

        const project = await getProject(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const requests = getStoredAccessRequests();

        // Check for existing request
        const existing = requests.find(
            r => r.projectId === projectId && r.investorAddress === investorAddress
        );

        if (existing && existing.status === 'pending') {
            throw new Error('Access request already pending');
        }

        const request: AccessRequest = {
            id: generateProjectId().slice(0, 16),
            projectId,
            investorAddress,
            founderAddress: project.founder,
            status: 'pending',
            message,
            createdAt: Date.now(),
        };

        requests.push(request);
        saveStoredAccessRequests(requests);

        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('✅ [Simulation] Access request created');

        return request;

    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

/**
 * Get access requests for a project (founder view)
 */
export async function getProjectAccessRequests(
    projectId: string,
    founderAddress: string
): Promise<AccessRequest[]> {
    if (isSimulationMode()) {
        const requests = getStoredAccessRequests();
        return requests.filter(
            r => r.projectId === projectId && r.founderAddress === founderAddress
        );
    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

/**
 * Get access requests by investor
 */
export async function getInvestorAccessRequests(
    investorAddress: string
): Promise<AccessRequest[]> {
    if (isSimulationMode()) {
        const requests = getStoredAccessRequests();
        return requests.filter(r => r.investorAddress === investorAddress);
    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

/**
 * Respond to an access request (approve/reject)
 */
export async function respondToAccessRequest(
    requestId: string,
    founderAddress: string,
    approve: boolean
): Promise<AccessRequest> {
    if (isSimulationMode()) {
        const requests = getStoredAccessRequests();
        const request = requests.find(r => r.id === requestId);

        if (!request) {
            throw new Error('Access request not found');
        }

        if (request.founderAddress !== founderAddress) {
            throw new Error('Only the founder can respond to this request');
        }

        request.status = approve ? 'approved' : 'rejected';
        request.respondedAt = Date.now();

        saveStoredAccessRequests(requests);

        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return request;

    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

/**
 * Get access request status for a specific project/investor combo
 */
export async function getAccessRequestStatus(
    projectId: string,
    investorAddress: string
): Promise<AccessRequest | null> {
    if (isSimulationMode()) {
        const requests = getStoredAccessRequests();
        return requests.find(
            r => r.projectId === projectId && r.investorAddress === investorAddress
        ) || null;
    } else {
        throw new Error('Production mode requires Anchor client.');
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear all simulation data (for testing)
 */
export function clearSimulationData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_REQUESTS);
    console.log('🗑️ [Simulation] All data cleared');
}

/**
 * Get statistics about stored data (for debugging)
 */
export function getSimulationStats(): { projects: number; accessRequests: number } {
    return {
        projects: getStoredProjects().length,
        accessRequests: getStoredAccessRequests().length,
    };
}
