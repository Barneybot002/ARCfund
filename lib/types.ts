/**
 * TypeScript type definitions for ARCfund
 */

export interface Project {
    id: string;
    title: string;
    description: string;
    pitch?: string; // Full pitch, only visible if user has access
    fundingGoal: number;
    currentFunding: number;
    founder: string; // Wallet address
    founderName?: string;
    createdAt: string;
    updatedAt?: string;
    isPrivate: boolean;
    isEncrypted: boolean;
    encryptedData?: string; // Base64 encoded encrypted data
    category?: ProjectCategory;
    status: ProjectStatus;
    imageUrl?: string;
    tags?: string[];
    team?: TeamMember[];
    timeline?: string;
    roadmap?: string;
}

export enum ProjectCategory {
    DEFI = 'DeFi',
    NFT = 'NFT',
    GAMING = 'GameFi',
    INFRASTRUCTURE = 'Infrastructure',
    DAO = 'DAO',
    SOCIAL = 'Social',
    OTHER = 'Other',
}

export enum ProjectStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    FUNDED = 'funded',
    CLOSED = 'closed',
}

export interface TeamMember {
    name: string;
    role: string;
    avatar?: string;
    twitter?: string;
    github?: string;
}

export interface Investment {
    id: string;
    projectId: string;
    investor: string; // Wallet address
    amount: number;
    timestamp: string;
    txHash?: string;
}

export interface AccessRequest {
    id: string;
    projectId: string;
    investor: string; // Wallet address
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    approvedAt?: string;
}

export interface User {
    address: string;
    email?: string;
    name?: string;
    avatar?: string;
    projectsCreated: string[]; // Project IDs
    investments: string[]; // Investment IDs
    accessRequests: string[]; // AccessRequest IDs
}

// Privy user types
export interface PrivyUser {
    id: string;
    createdAt: Date;
    linkedAccounts: Array<{
        type: string;
        address?: string;
        email?: string;
    }>;
    wallet?: {
        address: string;
        chainType: 'ethereum' | 'solana';
    };
}
