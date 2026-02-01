/**
 * Solana Program Interaction Client
 *
 * This module handles interactions with the ARCfund Solana program:
 * - Creating projects
 * - Storing encrypted data
 * - Managing access requests
 */
import { Program, setProvider } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram, } from '@solana/web3.js';
import { arciumConfig } from './arcium-config';
// Program IDL (Interface Description Language)
// This would normally be generated from the Anchor program build
const IDL = {
    version: '0.1.0',
    name: 'arcfund_mxe',
    instructions: [
        {
            name: 'initializeProject',
            accounts: [
                { name: 'project', isMut: true, isSigner: false },
                { name: 'founder', isMut: true, isSigner: true },
                { name: 'systemProgram', isMut: false, isSigner: false },
            ],
            args: [
                { name: 'projectId', type: 'string' },
                { name: 'founder', type: 'publicKey' },
            ],
        },
        {
            name: 'storeEncryptedData',
            accounts: [
                { name: 'project', isMut: true, isSigner: false },
                { name: 'founder', isMut: false, isSigner: true },
            ],
            args: [
                { name: 'encryptedPayload', type: 'bytes' },
            ],
        },
        {
            name: 'requestAccess',
            accounts: [
                { name: 'accessRequest', isMut: true, isSigner: false },
                { name: 'investor', isMut: true, isSigner: true },
                { name: 'systemProgram', isMut: false, isSigner: false },
            ],
            args: [
                { name: 'projectId', type: 'string' },
            ],
        },
        {
            name: 'approveAccess',
            accounts: [
                { name: 'accessRequest', isMut: true, isSigner: false },
                { name: 'founder', isMut: false, isSigner: true },
            ],
            args: [],
        },
        {
            name: 'denyAccess',
            accounts: [
                { name: 'accessRequest', isMut: true, isSigner: false },
                { name: 'founder', isMut: false, isSigner: true },
            ],
            args: [],
        },
    ],
    accounts: [
        {
            name: 'Project',
            fields: [
                { name: 'projectId', type: 'string' },
                { name: 'founder', type: 'publicKey' },
                { name: 'encryptedData', type: 'bytes' },
                { name: 'isEncrypted', type: 'bool' },
                { name: 'createdAt', type: 'i64' },
                { name: 'updatedAt', type: 'i64' },
            ],
        },
        {
            name: 'AccessRequest',
            fields: [
                { name: 'investor', type: 'publicKey' },
                { name: 'projectId', type: 'string' },
                { name: 'status', type: { defined: 'AccessStatus' } },
                { name: 'requestedAt', type: 'i64' },
                { name: 'approvedAt', type: { option: 'i64' } },
            ],
        },
    ],
    types: [
        {
            name: 'AccessStatus',
            type: 'enum',
            variants: [
                { name: 'Pending' },
                { name: 'Approved' },
                { name: 'Denied' },
            ],
        },
    ],
};
export class SolanaProjectClient {
    constructor() {
        this.program = null;
        // Initialize Solana connection
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        this.connection = new Connection(rpcUrl, 'processed');
        // Set program ID
        if (!arciumConfig.programId) {
            throw new Error('NEXT_PUBLIC_ARCIUM_PROGRAM_ID not configured');
        }
        this.programId = new PublicKey(arciumConfig.programId);
    }
    /**
     * Initialize the program with a provider
     * This requires a connected wallet (via Privy)
     */
    async initialize(provider) {
        setProvider(provider);
        try {
            // Create program instance
            this.program = new Program(IDL, this.programId, provider);
            console.log('✅ Solana program client initialized');
        }
        catch (error) {
            console.error('❌ Failed to initialize program:', error);
            throw error;
        }
    }
    /**
     * Create a new project with encrypted data
     *
     * @param projectId - Unique project identifier
     * @param founderAddress - Wallet address of project founder
     * @param encryptedData - Pre-encrypted project data (from Arcium)
     * @returns Transaction signature
     */
    async createProject(projectId, founderAddress, encryptedData) {
        if (!this.program) {
            throw new Error('Program not initialized. Call initialize() first.');
        }
        try {
            // Derive project account PDA
            const [projectPda] = PublicKey.findProgramAddressSync([Buffer.from('project'), Buffer.from(projectId)], this.programId);
            // Send transaction
            const tx = await this.program.methods
                .initializeProject(projectId, founderAddress)
                .accounts({
                project: projectPda,
                founder: founderAddress,
                systemProgram: SystemProgram.programId,
            })
                .rpc();
            console.log(`✅ Project created: ${projectId}`);
            console.log(`   Transaction: ${tx}`);
            // Now store the encrypted data
            await this.storeEncryptedData(projectId, encryptedData);
            return tx;
        }
        catch (error) {
            console.error('❌ Failed to create project:', error);
            throw error;
        }
    }
    /**
     * Store encrypted project data on-chain
     *
     * @param projectId - Project identifier
     * @param encryptedData - Encrypted data payload
     * @returns Transaction signature
     */
    async storeEncryptedData(projectId, encryptedData) {
        if (!this.program) {
            throw new Error('Program not initialized');
        }
        try {
            const [projectPda] = PublicKey.findProgramAddressSync([Buffer.from('project'), Buffer.from(projectId)], this.programId);
            const tx = await this.program.methods
                .storeEncryptedData(encryptedData)
                .accounts({
                project: projectPda,
            })
                .rpc();
            console.log(`✅ Encrypted data stored for project: ${projectId}`);
            return tx;
        }
        catch (error) {
            console.error('❌ Failed to store encrypted data:', error);
            throw error;
        }
    }
    /**
     * Get project details from on-chain
     *
     * @param projectId - Project identifier
     * @returns Project data
     */
    async getProject(projectId) {
        if (!this.program) {
            throw new Error('Program not initialized');
        }
        try {
            const [projectPda] = PublicKey.findProgramAddressSync([Buffer.from('project'), Buffer.from(projectId)], this.programId);
            const project = await this.program.account.project.fetch(projectPda);
            console.log('✅ Project retrieved:', projectId);
            return project;
        }
        catch (error) {
            console.error('❌ Failed to get project:', error);
            throw error;
        }
    }
    /**
     * Request access to a private project
     *
     * @param projectId - Project identifier
     * @param investorAddress - Investor's wallet address
     * @returns Transaction signature
     */
    async requestAccess(projectId, investorAddress) {
        if (!this.program) {
            throw new Error('Program not initialized');
        }
        try {
            const [accessRequestPda] = PublicKey.findProgramAddressSync([
                Buffer.from('access'),
                investorAddress.toBuffer(),
                Buffer.from(projectId),
            ], this.programId);
            const tx = await this.program.methods
                .requestAccess(projectId)
                .accounts({
                accessRequest: accessRequestPda,
                investor: investorAddress,
                systemProgram: SystemProgram.programId,
            })
                .rpc();
            console.log(`✅ Access request created for ${projectId}`);
            return tx;
        }
        catch (error) {
            console.error('❌ Failed to request access:', error);
            throw error;
        }
    }
    /**
     * Check access status for a project
     *
     * @param projectId - Project identifier
     * @param investorAddress - Investor's wallet address
     * @returns Access status or null if not found
     */
    async checkAccess(projectId, investorAddress) {
        if (!this.program) {
            throw new Error('Program not initialized');
        }
        try {
            const [accessRequestPda] = PublicKey.findProgramAddressSync([
                Buffer.from('access'),
                investorAddress.toBuffer(),
                Buffer.from(projectId),
            ], this.programId);
            const accessRequest = await this.program.account.accessRequest.fetch(accessRequestPda);
            console.log('✅ Access status retrieved');
            return accessRequest;
        }
        catch (error) {
            console.log('ℹ️  No access request found or program not initialized');
            return null;
        }
    }
    /**
     * Approve an access request (founder only)
     *
     * @param projectId - Project identifier
     * @param investorAddress - Investor's wallet address
     * @param founderAddress - Founder's wallet address
     * @returns Transaction signature
     */
    async approveAccess(projectId, investorAddress, founderAddress) {
        if (!this.program) {
            throw new Error('Program not initialized');
        }
        try {
            const [accessRequestPda] = PublicKey.findProgramAddressSync([
                Buffer.from('access'),
                investorAddress.toBuffer(),
                Buffer.from(projectId),
            ], this.programId);
            const tx = await this.program.methods
                .approveAccess()
                .accounts({
                accessRequest: accessRequestPda,
                founder: founderAddress,
            })
                .rpc();
            console.log(`✅ Access approved for investor`);
            return tx;
        }
        catch (error) {
            console.error('❌ Failed to approve access:', error);
            throw error;
        }
    }
    /**
     * Deny an access request (founder only)
     *
     * @param projectId - Project identifier
     * @param investorAddress - Investor's wallet address
     * @param founderAddress - Founder's wallet address
     * @returns Transaction signature
     */
    async denyAccess(projectId, investorAddress, founderAddress) {
        if (!this.program) {
            throw new Error('Program not initialized');
        }
        try {
            const [accessRequestPda] = PublicKey.findProgramAddressSync([
                Buffer.from('access'),
                investorAddress.toBuffer(),
                Buffer.from(projectId),
            ], this.programId);
            const tx = await this.program.methods
                .denyAccess()
                .accounts({
                accessRequest: accessRequestPda,
                founder: founderAddress,
            })
                .rpc();
            console.log(`✅ Access denied`);
            return tx;
        }
        catch (error) {
            console.error('❌ Failed to deny access:', error);
            throw error;
        }
    }
    /**
     * Get the program connection
     */
    getConnection() {
        return this.connection;
    }
    /**
     * Get the program ID
     */
    getProgramId() {
        return this.programId;
    }
}
// Export singleton instance
export const solanaProjectClient = new SolanaProjectClient();
