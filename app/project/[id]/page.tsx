/**
 * Project Detail Page [id]
 * ========================
 * 
 * Shows project details with encryption guard for private projects.
 * Integrates with Arcium MXE for decryption and access management.
 * 
 * FEATURES:
 * - Displays public project info
 * - Shows encrypted content guard for private projects
 * - Handles access requests and decryption
 * - Real-time decryption status feedback
 */

'use client';

import React, { useState, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { formatDate, formatCurrency, getFundingProgress, truncateAddress } from '@/lib/dummy-data';
import EncryptionBadge from '@/components/EncryptionBadge';
import ArciumBadge from '@/components/ArciumBadge';
import { slideRight, slideUp } from '@/lib/animations';
import { getUserProfile } from '@/lib/user-storage';
import {
    getProjectWithAccess,
    requestAccess,
    ProjectWithAccess,
    EncryptionState,
    isSimulationMode,
    getModeIndicator,
} from '@/lib/project-storage';

// Also try to get from dummy data for demo purposes
import { getProjectById, Project as DummyProject } from '@/lib/dummy-data';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const router = useRouter();
    const { ready, authenticated, login, user } = usePrivy();

    // State
    const [project, setProject] = useState<ProjectWithAccess | DummyProject | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [decryptionState, setDecryptionState] = useState<EncryptionState>({ status: 'idle' });
    const [accessRequestState, setAccessRequestState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [accessMessage, setAccessMessage] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    // Load project data
    useEffect(() => {
        async function loadProject() {
            setIsLoading(true);

            try {
                const userAddress = user?.wallet?.address;

                // First try to load from our storage
                const storedProject = await getProjectWithAccess(
                    projectId,
                    userAddress || '',
                    (state) => setDecryptionState(state)
                );

                if (storedProject) {
                    setProject(storedProject);
                    setIsOwner(storedProject.founder === userAddress);
                } else {
                    // Fall back to dummy data for demo
                    const dummyProject = getProjectById(projectId);
                    if (dummyProject) {
                        setProject(dummyProject);
                        setIsOwner(false);
                    }
                }
            } catch (error) {
                console.error('Error loading project:', error);
                // Try dummy data as fallback
                const dummyProject = getProjectById(projectId);
                if (dummyProject) {
                    setProject(dummyProject);
                }
            } finally {
                setIsLoading(false);
            }
        }

        if (ready) {
            loadProject();
        }
    }, [projectId, ready, user?.wallet?.address]);

    // Handle access request
    const handleRequestAccess = async () => {
        if (!authenticated) {
            login();
            return;
        }

        if (!user?.wallet?.address) {
            return;
        }

        setAccessRequestState('sending');

        try {
            await requestAccess(projectId, user.wallet.address, accessMessage);
            setAccessRequestState('sent');
        } catch (error) {
            console.error('Error requesting access:', error);
            setAccessRequestState('error');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-purple-500 mx-auto mb-4\" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <p className="text-gray-400">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        notFound();
    }

    // Type guards
    const isStoredProject = (p: ProjectWithAccess | DummyProject): p is ProjectWithAccess => {
        return 'hasAccess' in p;
    };

    const hasAccess = isStoredProject(project) ? project.hasAccess : !project.isPrivate;
    const accessRequestStatus = isStoredProject(project) ? project.accessRequestStatus : 'none';
    const decryptedPitch = isStoredProject(project) ? project.decryptedPitch : undefined;
    const projectTitle = project.title;
    const isPrivate = project.isPrivate;
    const progress = getFundingProgress(project as DummyProject);
    const modeInfo = getModeIndicator();

    // User has access - show full content
    const userHasAccess = !isPrivate || hasAccess || isOwner;

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Projects
                </Link>

                {/* Project Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideRight}
                    className="mb-12"
                >
                    {/* Category & Encryption Badge */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {'category' in project && project.category && (
                            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg font-medium border border-purple-500/30">
                                {project.category}
                            </span>
                        )}
                        {isPrivate && (
                            <EncryptionBadge
                                isEncrypted={true}
                                hasAccess={hasAccess}
                                showTooltip={true}
                            />
                        )}
                        {isOwner && (
                            <span className="px-4 py-2 bg-green-600/20 text-green-300 rounded-lg font-medium border border-green-500/30">
                                Your Project
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        {projectTitle}
                    </h1>

                    {/* Founder Info */}
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span>{'founderName' in project ? project.founderName : 'Anonymous'}</span>
                        </div>
                        <span>•</span>
                        <span>{truncateAddress(project.founder)}</span>
                        <span>•</span>
                        <span>{formatDate(project.createdAt)}</span>
                    </div>
                </motion.div>

                {userHasAccess ? (
                    <>
                        {/* Decryption Status */}
                        <AnimatePresence>
                            {decryptionState.status !== 'idle' && decryptionState.status !== 'decrypted' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl"
                                >
                                    <div className="flex items-center gap-3 text-purple-300">
                                        {decryptionState.status === 'decrypting' && (
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                        )}
                                        <span>{decryptionState.message}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Project Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={slideUp}
                            className="grid lg:grid-cols-3 gap-8"
                        >
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* About / Pitch */}
                                <div className="bg-gray-800/50 rounded-xl p-8 border border-purple-500/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-white">About This Project</h2>
                                        {isPrivate && hasAccess && (
                                            <div className="flex items-center gap-2 text-sm text-green-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                </svg>
                                                Decrypted
                                            </div>
                                        )}
                                    </div>

                                    {isPrivate && hasAccess && (
                                        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                                            <p className="text-sm text-green-400 flex items-center gap-2">
                                                <span>{modeInfo.emoji}</span>
                                                Viewing decrypted content via {modeInfo.label}
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                        {decryptedPitch || ('pitch' in project ? project.pitch : project.description) || project.description || 'No description available.'}
                                    </p>
                                </div>

                                {/* Public Description (for private projects) */}
                                {isPrivate && 'publicDescription' in project && project.publicDescription && (
                                    <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
                                        <h2 className="text-xl font-bold mb-4 text-white">Public Summary</h2>
                                        <p className="text-gray-400 leading-relaxed">
                                            {project.publicDescription}
                                        </p>
                                    </div>
                                )}

                                {/* Team */}
                                {'team' in project && project.team && project.team.length > 0 && (
                                    <div className="bg-gray-800/50 rounded-xl p-8 border border-purple-500/20">
                                        <h2 className="text-2xl font-bold mb-6 text-white">Team</h2>
                                        <div className="space-y-4">
                                            {project.team.map((member, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {member.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">{member.name}</div>
                                                        <div className="text-sm text-gray-400">{member.role}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Timeline */}
                                {'timeline' in project && project.timeline && (
                                    <div className="bg-gray-800/50 rounded-xl p-8 border border-purple-500/20">
                                        <h2 className="text-2xl font-bold mb-4 text-white">Timeline</h2>
                                        <p className="text-gray-300">{project.timeline}</p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Funding Card */}
                                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm sticky top-24">
                                    <h3 className="text-2xl font-bold mb-6 text-white">Funding</h3>

                                    {/* Progress */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <span className="text-3xl font-bold text-white">
                                                {formatCurrency('currentFunding' in project ? project.currentFunding : 0)}
                                            </span>
                                            <span className="text-purple-400 font-semibold">{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                                transition={{ duration: 1 }}
                                                className="h-full bg-gradient-to-r from-purple-600 to-violet-600"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            of {formatCurrency('fundingGoal' in project ? project.fundingGoal : 0)} goal
                                        </p>
                                    </div>

                                    {/* Invest Button */}
                                    {authenticated ? (
                                        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-lg font-semibold transition-all hover:scale-105">
                                            Invest Now
                                        </button>
                                    ) : (
                                        <button
                                            onClick={login}
                                            className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                                        >
                                            Connect Wallet to Invest
                                        </button>
                                    )}

                                    {/* Tags */}
                                    {'tags' in project && project.tags && project.tags.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-700">
                                            <h4 className="text-sm font-semibold text-gray-400 mb-3">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 bg-purple-600/10 text-purple-300 text-sm rounded-md border border-purple-500/20"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                ) : (
                    /* Private Project - No Access */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-purple-500/30 p-10">
                            {/* Lock Icon */}
                            <div className="w-24 h-24 mx-auto mb-6 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-white mb-3">
                                This Project is Private
                            </h2>
                            <p className="text-gray-400 text-center mb-6">
                                The pitch details are encrypted using{' '}
                                <span className="text-purple-400">{modeInfo.label}</span>.
                                Request access to view the full project information.
                            </p>

                            {/* Arcium Badge */}
                            <div className="flex justify-center mb-6">
                                <ArciumBadge />
                            </div>

                            {/* Public Description Preview */}
                            {'publicDescription' in project && project.publicDescription && (
                                <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700/50">
                                    <h4 className="font-semibold text-white mb-2">Public Summary:</h4>
                                    <p className="text-gray-400 text-sm">{project.publicDescription}</p>
                                </div>
                            )}

                            {/* Access Status */}
                            {accessRequestStatus === 'pending' || accessRequestState === 'sent' ? (
                                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl text-center">
                                    <p className="text-yellow-400">
                                        ⏳ Access request pending. The founder will review your request.
                                    </p>
                                </div>
                            ) : accessRequestStatus === 'rejected' ? (
                                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                                    <p className="text-red-400">
                                        ❌ Your access request was declined.
                                    </p>
                                </div>
                            ) : authenticated ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={accessMessage}
                                        onChange={(e) => setAccessMessage(e.target.value)}
                                        placeholder="Optional: Add a message to the founder..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white resize-none"
                                    />
                                    <button
                                        onClick={handleRequestAccess}
                                        disabled={accessRequestState === 'sending'}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {accessRequestState === 'sending' ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Sending Request...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                </svg>
                                                Request Access
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={login}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-xl font-semibold transition-all"
                                >
                                    Connect Wallet to Request Access
                                </button>
                            )}

                            {/* How It Works */}
                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <h4 className="font-medium text-white mb-3 text-center">How Access Works</h4>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-purple-400 font-bold">1</span>
                                        </div>
                                        <p className="text-xs text-gray-400">Request access</p>
                                    </div>
                                    <div>
                                        <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-purple-400 font-bold">2</span>
                                        </div>
                                        <p className="text-xs text-gray-400">Founder approves</p>
                                    </div>
                                    <div>
                                        <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-purple-400 font-bold">3</span>
                                        </div>
                                        <p className="text-xs text-gray-400">View decrypted pitch</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
