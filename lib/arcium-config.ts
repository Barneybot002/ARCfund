/**
 * Arcium MXE Integration - Configuration & Client
 * ================================================
 * 
 * This module provides both REAL Arcium MXE integration and a SIMULATION MODE
 * for development/demo purposes when the full MXE infrastructure isn't available.
 * 
 * SIMULATION MODE (Default for hackathon demo):
 * - Uses local encryption (AES-256-GCM) to simulate the encryption flow
 * - Stores "encrypted" data in localStorage for demo
 * - Shows the same UI/UX as real implementation
 * - Toggle with: NEXT_PUBLIC_ARCIUM_SIMULATION_MODE=true
 * 
 * PRODUCTION MODE:
 * - Uses real Arcium MXE for multi-party computation
 * - Encrypts with RescueCipher and x25519 key exchange
 * - Submits computations to MPC cluster
 * - Toggle with: NEXT_PUBLIC_ARCIUM_SIMULATION_MODE=false
 * 
 * Documentation: https://docs.arcium.com/
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

export const ARCIUM_CONFIG = {
    // Network settings
    network: (process.env.NEXT_PUBLIC_ARCIUM_NETWORK || 'devnet') as 'devnet' | 'mainnet',
    solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',

    // Program IDs (set after deployment)
    arcfundProgramId: process.env.NEXT_PUBLIC_ARCFUND_PROGRAM_ID || '',
    arciumProgramId: process.env.NEXT_PUBLIC_ARCIUM_PROGRAM_ID || 'arc1umE2cLaXZLt24JGLKvxPzNSrtEzHVB8wVSTPzBi2',

    // Cluster configuration
    clusterOffset: parseInt(process.env.NEXT_PUBLIC_ARCIUM_CLUSTER_OFFSET || '0'),

    // SIMULATION MODE - Set to false when real Arcium is ready
    simulationMode: process.env.NEXT_PUBLIC_ARCIUM_SIMULATION_MODE !== 'false',

    // Max pitch size (bytes) - Arcium has callback size limits
    maxPitchSize: 2048,
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface EncryptedProjectData {
    /** Unique identifier for the encrypted data */
    id: string;

    /** Encrypted pitch content (base64) */
    encryptedPitch: string;

    /** Public key used for encryption (hex) */
    publicKey: string;

    /** Nonce used for encryption (hex) */
    nonce: string;

    /** Timestamp of encryption */
    encryptedAt: number;

    /** Whether this is simulated or real encryption */
    isSimulated: boolean;

    /** For real Arcium: computation reference */
    computationRef?: string;
}

export interface DecryptedProjectData {
    /** Original pitch content */
    pitch: string;

    /** Timestamp of decryption */
    decryptedAt: number;
}

export interface AccessPermission {
    /** Project ID */
    projectId: string;

    /** Investor wallet address */
    investorAddress: string;

    /** Founder wallet address */
    founderAddress: string;

    /** Whether access is granted */
    isGranted: boolean;

    /** When access was granted */
    grantedAt?: number;

    /** Access token for decryption (simulated mode) */
    accessToken?: string;
}

export interface ProjectOnChain {
    /** Project ID (32 bytes as hex) */
    id: string;

    /** Founder's wallet address */
    founder: string;

    /** Project title */
    title: string;

    /** Whether the project pitch is encrypted */
    isPrivate: boolean;

    /** Reference to encrypted data */
    encryptedRef?: string;

    /** Creation timestamp */
    createdAt: number;

    /** Public (unencrypted) description for discovery */
    publicDescription?: string;

    /** Category */
    category?: string;

    /** Funding goal in USD */
    fundingGoal?: number;
}

// ============================================================================
// ENCRYPTION STATUS TYPES
// ============================================================================

export type EncryptionStatus =
    | 'idle'
    | 'encrypting'
    | 'encrypted'
    | 'decrypting'
    | 'decrypted'
    | 'error';

export interface EncryptionState {
    status: EncryptionStatus;
    message?: string;
    progress?: number;
    error?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if Arcium simulation mode is enabled
 */
export function isSimulationMode(): boolean {
    return ARCIUM_CONFIG.simulationMode;
}

/**
 * Check if the environment is properly configured for real Arcium
 */
export function isArciumReady(): boolean {
    if (ARCIUM_CONFIG.simulationMode) {
        return true; // Simulation always works
    }

    return !!(
        ARCIUM_CONFIG.arcfundProgramId &&
        ARCIUM_CONFIG.solanaRpcUrl
    );
}

/**
 * Get a display-friendly status message
 */
export function getEncryptionStatusMessage(status: EncryptionStatus, isSimulated: boolean): string {
    const prefix = isSimulated ? '🔄 [Demo] ' : '🔐 [Arcium] ';

    switch (status) {
        case 'idle':
            return '';
        case 'encrypting':
            return prefix + 'Encrypting your pitch...';
        case 'encrypted':
            return prefix + 'Pitch encrypted successfully!';
        case 'decrypting':
            return prefix + 'Decrypting pitch...';
        case 'decrypted':
            return prefix + 'Pitch decrypted successfully!';
        case 'error':
            return '❌ Encryption error occurred';
        default:
            return '';
    }
}

/**
 * Generate a random ID for projects
 */
export function generateProjectId(): string {
    const bytes = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(bytes);
    } else {
        // Fallback for SSR
        for (let i = 0; i < 32; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert hex string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ARCIUM_CONFIG as arciumConfig };
