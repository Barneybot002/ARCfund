/**
 * Dummy data for ARCfund platform
 * Used for demonstration and testing
 */
import { ProjectCategory, ProjectStatus } from './types';
export const dummyProjects = [
    {
        id: '1',
        title: 'DeFi Lending Protocol',
        description: 'A revolutionary peer-to-peer lending platform built on Solana with zero-knowledge proofs for maximum privacy.',
        pitch: 'Our protocol enables users to lend and borrow assets with complete privacy. Using advanced cryptography, we ensure that loan amounts, collateral, and interest rates remain confidential while maintaining full auditability for regulators.',
        fundingGoal: 500000,
        currentFunding: 125000,
        founder: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        founderName: 'Alex Chen',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        isPrivate: false,
        isEncrypted: false,
        category: ProjectCategory.DEFI,
        status: ProjectStatus.ACTIVE,
        imageUrl: '/projects/defi-lending.jpg',
        tags: ['DeFi', 'Lending', 'Privacy', 'Solana'],
        team: [
            {
                name: 'Alex Chen',
                role: 'CEO & Founder',
                twitter: 'alexchen',
            },
            {
                name: 'Sarah Martinez',
                role: 'CTO',
                twitter: 'sarahmartinez',
            },
        ],
        timeline: 'Q1 2024 - Launch Beta, Q2 2024 - Mainnet',
        roadmap: 'Phase 1: Core Protocol\nPhase 2: Governance\nPhase 3: Cross-chain',
    },
    {
        id: '2',
        title: 'Confidential NFT Marketplace',
        description: '[ENCRYPTED WITH ARCIUM MXE] 🔐 This project pitch is private. Request access to view full details.',
        pitch: '[ENCRYPTED] You must request access from the founder to view this content.',
        fundingGoal: 750000,
        currentFunding: 0,
        founder: '0xabcd1234567890efghijklmnopqrstuv',
        founderName: 'Anonymous Founder',
        createdAt: '2024-01-20',
        isPrivate: true,
        isEncrypted: true,
        encryptedData: 'BASE64_ENCRYPTED_DATA_HERE', // Placeholder
        category: ProjectCategory.NFT,
        status: ProjectStatus.ACTIVE,
        tags: ['NFT', 'Marketplace', 'Confidential', 'Arcium MXE'],
        team: [
            {
                name: 'Confidential',
                role: 'Team information encrypted',
            },
        ],
        timeline: 'Request access to view timeline',
    },
    {
        id: '3',
        title: 'GameFi Platform',
        description: 'Next-generation gaming economy with true asset ownership, play-to-earn mechanics, and builder-first tools.',
        pitch: 'We are building the ultimate GameFi platform where players truly own their in-game assets as NFTs. Our SDK allows game developers to easily integrate blockchain mechanics, while our marketplace provides liquidity for all gaming assets.',
        fundingGoal: 1000000,
        currentFunding: 450000,
        founder: '0x9876543210fedcba',
        founderName: 'Jamie Williams',
        createdAt: '2024-01-25',
        isPrivate: false,
        isEncrypted: false,
        category: ProjectCategory.GAMING,
        status: ProjectStatus.ACTIVE,
        imageUrl: '/projects/gamefi.jpg',
        tags: ['GameFi', 'Play-to-Earn', 'NFT', 'Gaming'],
        team: [
            {
                name: 'Jamie Williams',
                role: 'Founder & Game Designer',
                twitter: 'jamiewilliams',
            },
            {
                name: 'Marcus Lee',
                role: 'Blockchain Engineer',
                github: 'marcuslee',
            },
            {
                name: 'Olivia Park',
                role: 'Community Lead',
                twitter: 'oliviapark',
            },
        ],
        timeline: 'Q2 2024 - SDK Release, Q3 2024 - Marketplace Launch',
        roadmap: 'Phase 1: SDK & Tools\nPhase 2: Marketplace\nPhase 3: Gaming Guild',
    },
    {
        id: '4',
        title: 'Private DAO Infrastructure',
        description: '[ENCRYPTED WITH ARCIUM MXE] 🔐 Confidential voting and governance platform. Request access for details.',
        pitch: '[ENCRYPTED] Request access to view full project details.',
        fundingGoal: 600000,
        currentFunding: 100000,
        founder: '0xprivatefounder123',
        founderName: 'Confidential',
        createdAt: '2024-01-28',
        isPrivate: true,
        isEncrypted: true,
        encryptedData: 'BASE64_ENCRYPTED_DAO_DATA',
        category: ProjectCategory.DAO,
        status: ProjectStatus.ACTIVE,
        tags: ['DAO', 'Governance', 'Privacy', 'Arcium'],
        timeline: 'Encrypted - Request Access',
    },
    {
        id: '5',
        title: 'Decentralized Social Network',
        description: 'Web3 social platform with user-owned data, token-gated communities, and creator monetization.',
        pitch: 'Our decentralized social network puts users back in control of their data and content. With built-in creator tools, NFT profiles, and token-gated communities, we are rebuilding social media for the Web3 era.',
        fundingGoal: 800000,
        currentFunding: 320000,
        founder: '0xsocialfounder',
        founderName: 'Emma Thompson',
        createdAt: '2024-01-12',
        isPrivate: false,
        isEncrypted: false,
        category: ProjectCategory.SOCIAL,
        status: ProjectStatus.ACTIVE,
        tags: ['Social', 'Web3', 'Creator Economy', 'NFT'],
        team: [
            {
                name: 'Emma Thompson',
                role: 'CEO',
                twitter: 'emmathompson',
            },
        ],
        timeline: 'Q1 2024 - Beta Launch, Q2 2024 - Creator Tools',
    },
    {
        id: '6',
        title: 'Cross-Chain Bridge Protocol',
        description: 'Secure, fast, and private asset bridging between Solana, Ethereum, and other chains using Arcium MXE.',
        pitch: 'Our bridge protocol leverages Arcium\'s confidential computing to enable private cross-chain transfers. Users can bridge assets without revealing transaction amounts or wallet addresses.',
        fundingGoal: 1200000,
        currentFunding: 580000,
        founder: '0xbridgebuilder',
        founderName: 'Ryan Patel',
        createdAt: '2024-01-18',
        isPrivate: false,
        isEncrypted: false,
        category: ProjectCategory.INFRASTRUCTURE,
        status: ProjectStatus.ACTIVE,
        tags: ['Bridge', 'Cross-Chain', 'Infrastructure', 'Privacy'],
        team: [
            {
                name: 'Ryan Patel',
                role: 'Protocol Architect',
                github: 'ryanpatel',
            },
            {
                name: 'Sophia Kim',
                role: 'Security Lead',
                twitter: 'sophiakim',
            },
        ],
        timeline: 'Q2 2024 - Testnet, Q3 2024 - Mainnet Launch',
    },
];
/**
 * Get a project by ID
 */
export function getProjectById(id) {
    return dummyProjects.find((project) => project.id === id);
}
/**
 * Get all public projects
 */
export function getPublicProjects() {
    return dummyProjects.filter((project) => !project.isPrivate);
}
/**
 * Get all private/encrypted projects
 */
export function getPrivateProjects() {
    return dummyProjects.filter((project) => project.isPrivate);
}
/**
 * Filter projects by category
 */
export function getProjectsByCategory(category) {
    return dummyProjects.filter((project) => project.category === category);
}
/**
 * Calculate funding progress percentage
 */
export function getFundingProgress(project) {
    return Math.min((project.currentFunding / project.fundingGoal) * 100, 100);
}
/**
 * Format currency (USD)
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}
/**
 * Format date
 */
export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
/**
 * Truncate wallet address
 */
export function truncateAddress(address) {
    if (address.length < 10)
        return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
