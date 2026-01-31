/**
 * Arcium Encryption Client
 * ========================
 * 
 * Provides encryption/decryption functionality with two modes:
 * 
 * 1. SIMULATION MODE (for hackathon demo):
 *    - Uses Web Crypto API (AES-256-GCM) for local encryption
 *    - Demonstrates the UX flow without real MPC
 *    - Data is stored locally with simulated "on-chain" reference
 * 
 * 2. PRODUCTION MODE (with real Arcium MXE):
 *    - Uses @arcium-hq/client SDK
 *    - RescueCipher encryption with x25519 key exchange
 *    - Actual MPC computation on Arcium network
 * 
 * Toggle mode via: NEXT_PUBLIC_ARCIUM_SIMULATION_MODE=true/false
 */

import {
    ARCIUM_CONFIG,
    EncryptedProjectData,
    DecryptedProjectData,
    AccessPermission,
    EncryptionState,
    isSimulationMode,
    generateProjectId,
    bytesToHex,
    hexToBytes,
} from './arcium-config';

// ============================================================================
// LOCAL STORAGE KEYS (Simulation Mode)
// ============================================================================

const STORAGE_KEYS = {
    ENCRYPTED_PROJECTS: 'arcfund_encrypted_projects',
    ACCESS_PERMISSIONS: 'arcfund_access_permissions',
    ENCRYPTION_KEYS: 'arcfund_encryption_keys',
} as const;

// ============================================================================
// SIMULATION MODE: Local Encryption using Web Crypto API
// ============================================================================

/**
 * Generate encryption key for simulation mode
 */
async function generateSimulationKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Export CryptoKey to storable format
 */
async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return bytesToHex(new Uint8Array(exported));
}

/**
 * Import key from stored format
 */
async function importKey(keyHex: string): Promise<CryptoKey> {
    const keyData = hexToBytes(keyHex);
    return await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt data using AES-256-GCM (simulation mode)
 */
async function simulatedEncrypt(
    plaintext: string,
    key: CryptoKey
): Promise<{ ciphertext: Uint8Array; iv: Uint8Array }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    return {
        ciphertext: new Uint8Array(ciphertext),
        iv,
    };
}

/**
 * Decrypt data using AES-256-GCM (simulation mode)
 */
async function simulatedDecrypt(
    ciphertext: Uint8Array,
    iv: Uint8Array,
    key: CryptoKey
): Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

// ============================================================================
// STORAGE HELPERS (Simulation Mode)
// ============================================================================

interface StoredEncryptedProject {
    projectId: string;
    founderAddress: string;
    encryptedPitch: string;  // base64
    iv: string;              // hex
    keyId: string;           // reference to stored key
    createdAt: number;
}

interface StoredKey {
    keyId: string;
    keyHex: string;
    projectId: string;
}

function getStoredProjects(): StoredEncryptedProject[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_PROJECTS);
    return stored ? JSON.parse(stored) : [];
}

function saveStoredProjects(projects: StoredEncryptedProject[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_PROJECTS, JSON.stringify(projects));
}

function getStoredKeys(): StoredKey[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEYS);
    return stored ? JSON.parse(stored) : [];
}

function saveStoredKeys(keys: StoredKey[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEYS, JSON.stringify(keys));
}

function getStoredPermissions(): AccessPermission[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.ACCESS_PERMISSIONS);
    return stored ? JSON.parse(stored) : [];
}

function saveStoredPermissions(permissions: AccessPermission[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_PERMISSIONS, JSON.stringify(permissions));
}

// ============================================================================
// MAIN ENCRYPTION API
// ============================================================================

/**
 * Encrypt a project pitch
 * 
 * In SIMULATION MODE:
 * - Uses local AES-256-GCM encryption
 * - Stores encrypted data and key in localStorage
 * - Returns a reference ID
 * 
 * In PRODUCTION MODE:
 * - Uses Arcium MXE with RescueCipher
 * - Submits computation to MPC cluster
 * - Returns computation reference
 */
export async function encryptProjectPitch(
    pitch: string,
    founderAddress: string,
    projectId?: string,
    onStateChange?: (state: EncryptionState) => void
): Promise<EncryptedProjectData> {
    const id = projectId || generateProjectId();

    onStateChange?.({ status: 'encrypting', message: 'Preparing encryption...' });

    if (isSimulationMode()) {
        // ========== SIMULATION MODE ==========
        console.log('🔄 [Simulation] Encrypting project pitch locally...');

        // Generate encryption key
        const key = await generateSimulationKey();
        const keyHex = await exportKey(key);
        const keyId = generateProjectId().slice(0, 16);

        onStateChange?.({ status: 'encrypting', message: 'Encrypting data...', progress: 50 });

        // Encrypt the pitch
        const { ciphertext, iv } = await simulatedEncrypt(pitch, key);

        // Store the encrypted data
        const projects = getStoredProjects();
        const newProject: StoredEncryptedProject = {
            projectId: id,
            founderAddress,
            encryptedPitch: btoa(String.fromCharCode(...ciphertext)),
            iv: bytesToHex(iv),
            keyId,
            createdAt: Date.now(),
        };
        projects.push(newProject);
        saveStoredProjects(projects);

        // Store the key (in real system, this would be managed by MXE)
        const keys = getStoredKeys();
        keys.push({ keyId, keyHex, projectId: id });
        saveStoredKeys(keys);

        // Auto-grant founder access
        const permissions = getStoredPermissions();
        permissions.push({
            projectId: id,
            investorAddress: founderAddress,
            founderAddress,
            isGranted: true,
            grantedAt: Date.now(),
            accessToken: keyId,
        });
        saveStoredPermissions(permissions);

        onStateChange?.({ status: 'encrypted', message: 'Encryption complete!' });

        // Simulate network delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            id,
            encryptedPitch: newProject.encryptedPitch,
            publicKey: 'SIMULATED_' + keyId,
            nonce: newProject.iv,
            encryptedAt: Date.now(),
            isSimulated: true,
        };

    } else {
        // ========== PRODUCTION MODE (Arcium MXE) ==========
        console.log('🔐 [Arcium] Encrypting project pitch with MXE...');

        // TODO: Implement real Arcium SDK integration
        // This requires:
        // 1. @arcium-hq/client package
        // 2. Deployed MXE program
        // 3. Configured cluster

        /*
        import { RescueCipher, x25519, getArciumEnv } from '@arcium-hq/client';
        import { Connection, PublicKey } from '@solana/web3.js';
        
        const connection = new Connection(ARCIUM_CONFIG.solanaRpcUrl);
        const programId = new PublicKey(ARCIUM_CONFIG.arcfundProgramId);
        
        // Get MXE public key
        const mxePublicKey = await getMXEPublicKey(connection, programId);
        
        // Generate keypair for this encryption
        const privateKey = x25519.utils.randomSecretKey();
        const publicKey = x25519.getPublicKey(privateKey);
        
        // Create shared secret
        const sharedSecret = x25519.getSharedSecret(privateKey, mxePublicKey);
        const cipher = new RescueCipher(sharedSecret);
        
        // Encrypt
        const nonce = crypto.getRandomValues(new Uint8Array(16));
        const pitchBytes = new TextEncoder().encode(pitch);
        const ciphertext = cipher.encrypt([...pitchBytes], nonce);
        
        // Submit to MXE via Solana program
        // ... program.methods.createProject(...).rpc()
        
        return {
            id,
            encryptedPitch: bytesToHex(ciphertext),
            publicKey: bytesToHex(publicKey),
            nonce: bytesToHex(nonce),
            encryptedAt: Date.now(),
            isSimulated: false,
            computationRef: txSignature,
        };
        */

        // For now, throw error if production mode without SDK
        throw new Error(
            'Production Arcium mode requires @arcium-hq/client package. ' +
            'Set NEXT_PUBLIC_ARCIUM_SIMULATION_MODE=true for demo.'
        );
    }
}

/**
 * Decrypt a project pitch
 * 
 * In SIMULATION MODE:
 * - Retrieves encrypted data from localStorage
 * - Uses stored key to decrypt
 * - Verifies access permission
 * 
 * In PRODUCTION MODE:
 * - Verifies on-chain access permission
 * - Uses Arcium MXE to decrypt
 */
export async function decryptProjectPitch(
    projectId: string,
    investorAddress: string,
    onStateChange?: (state: EncryptionState) => void
): Promise<DecryptedProjectData | null> {
    onStateChange?.({ status: 'decrypting', message: 'Verifying access...' });

    if (isSimulationMode()) {
        // ========== SIMULATION MODE ==========
        console.log('🔄 [Simulation] Decrypting project pitch...');

        // Check access permission
        const permissions = getStoredPermissions();
        const permission = permissions.find(
            p => p.projectId === projectId &&
                p.investorAddress === investorAddress &&
                p.isGranted
        );

        if (!permission) {
            onStateChange?.({ status: 'error', error: 'Access denied' });
            return null;
        }

        onStateChange?.({ status: 'decrypting', message: 'Decrypting...', progress: 50 });

        // Get encrypted data
        const projects = getStoredProjects();
        const project = projects.find(p => p.projectId === projectId);

        if (!project) {
            onStateChange?.({ status: 'error', error: 'Project not found' });
            return null;
        }

        // Get key
        const keys = getStoredKeys();
        const keyData = keys.find(k => k.keyId === permission.accessToken);

        if (!keyData) {
            onStateChange?.({ status: 'error', error: 'Decryption key not found' });
            return null;
        }

        // Decrypt
        const key = await importKey(keyData.keyHex);
        const ciphertext = new Uint8Array(
            atob(project.encryptedPitch).split('').map(c => c.charCodeAt(0))
        );
        const iv = hexToBytes(project.iv);

        const pitch = await simulatedDecrypt(ciphertext, iv, key);

        onStateChange?.({ status: 'decrypted', message: 'Decryption complete!' });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            pitch,
            decryptedAt: Date.now(),
        };

    } else {
        // ========== PRODUCTION MODE ==========
        // TODO: Implement Arcium MXE decryption
        throw new Error('Production mode requires @arcium-hq/client package.');
    }
}

/**
 * Check if a user has access to a project
 */
export async function checkProjectAccess(
    projectId: string,
    userAddress: string
): Promise<boolean> {
    if (isSimulationMode()) {
        const permissions = getStoredPermissions();
        return permissions.some(
            p => p.projectId === projectId &&
                p.investorAddress === userAddress &&
                p.isGranted
        );
    } else {
        // TODO: Check on-chain access permission
        throw new Error('Production mode requires Solana client.');
    }
}

/**
 * Grant access to an investor
 */
export async function grantProjectAccess(
    projectId: string,
    investorAddress: string,
    founderAddress: string,
    onStateChange?: (state: EncryptionState) => void
): Promise<boolean> {
    onStateChange?.({ status: 'encrypting', message: 'Granting access...' });

    if (isSimulationMode()) {
        console.log('🔄 [Simulation] Granting access to investor...');

        // Get the key for this project
        const keys = getStoredKeys();
        const keyData = keys.find(k => k.projectId === projectId);

        if (!keyData) {
            onStateChange?.({ status: 'error', error: 'Project key not found' });
            return false;
        }

        // Grant permission
        const permissions = getStoredPermissions();

        // Check if already granted
        const existing = permissions.find(
            p => p.projectId === projectId && p.investorAddress === investorAddress
        );

        if (existing) {
            existing.isGranted = true;
            existing.grantedAt = Date.now();
            existing.accessToken = keyData.keyId;
        } else {
            permissions.push({
                projectId,
                investorAddress,
                founderAddress,
                isGranted: true,
                grantedAt: Date.now(),
                accessToken: keyData.keyId,
            });
        }

        saveStoredPermissions(permissions);

        onStateChange?.({ status: 'encrypted', message: 'Access granted!' });

        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return true;

    } else {
        // TODO: Call Solana program to grant access
        throw new Error('Production mode requires Solana client.');
    }
}

/**
 * Revoke access from an investor
 */
export async function revokeProjectAccess(
    projectId: string,
    investorAddress: string,
    founderAddress: string
): Promise<boolean> {
    if (isSimulationMode()) {
        const permissions = getStoredPermissions();
        const index = permissions.findIndex(
            p => p.projectId === projectId && p.investorAddress === investorAddress
        );

        if (index >= 0) {
            permissions[index].isGranted = false;
            saveStoredPermissions(permissions);
        }

        return true;
    } else {
        throw new Error('Production mode requires Solana client.');
    }
}

/**
 * Get list of investors with access to a project
 */
export function getProjectAccessList(projectId: string): AccessPermission[] {
    if (isSimulationMode()) {
        const permissions = getStoredPermissions();
        return permissions.filter(p => p.projectId === projectId && p.isGranted);
    }
    return [];
}

/**
 * Get all projects created by a founder (encrypted ones)
 */
export function getFounderEncryptedProjects(founderAddress: string): StoredEncryptedProject[] {
    if (isSimulationMode()) {
        const projects = getStoredProjects();
        return projects.filter(p => p.founderAddress === founderAddress);
    }
    return [];
}
