/**
 * Your Projects Page (Founder Dashboard)
 * =======================================
 * 
 * Shows projects created by the founder with:
 * - Project list with encryption status
 * - Access request management
 * - Ability to approve/reject requests
 * 
 * FOUNDER ONLY
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { getUserProfile, UserProfile } from '@/lib/user-storage';
import EncryptionBadge from '@/components/EncryptionBadge';
import { slideUp, staggerContainer, staggerItem } from '@/lib/animations';
import {
    getMyProjects,
    getPendingAccessRequests,
    approveAccess,
    rejectAccess,
    ProjectOnChain,
    AccessRequest,
    getModeIndicator,
} from '@/lib/project-storage';
import { formatCurrency } from '@/lib/dummy-data';

export default function YourProjectsPage() {
    const { ready, authenticated, login, user } = usePrivy();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [projects, setProjects] = useState<ProjectOnChain[]>([]);
    const [accessRequests, setAccessRequests] = useState<Record<string, AccessRequest[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [expandedProject, setExpandedProject] = useState<string | null>(null);
    const [processingRequest, setProcessingRequest] = useState<string | null>(null);

    // Load user profile
    useEffect(() => {
        if (!ready) return;
        if (authenticated) {
            const profile = getUserProfile();
            setUserProfile(profile);
        }
        setIsLoading(false);
    }, [ready, authenticated]);

    // Load projects and access requests
    useEffect(() => {
        async function loadData() {
            if (!user?.wallet?.address) return;

            try {
                const myProjects = await getMyProjects(user.wallet.address);
                setProjects(myProjects);

                // Load access requests for each project
                const requestsMap: Record<string, AccessRequest[]> = {};
                for (const project of myProjects) {
                    if (project.isPrivate) {
                        const requests = await getPendingAccessRequests(project.id, user.wallet.address);
                        if (requests.length > 0) {
                            requestsMap[project.id] = requests;
                        }
                    }
                }
                setAccessRequests(requestsMap);
            } catch (error) {
                console.error('Error loading projects:', error);
            }
        }

        if (authenticated && user?.wallet?.address) {
            loadData();
        }
    }, [authenticated, user?.wallet?.address]);

    // Handle approve access
    const handleApprove = async (request: AccessRequest) => {
        if (!user?.wallet?.address) return;

        setProcessingRequest(request.id);
        try {
            await approveAccess(
                request.id,
                request.projectId,
                request.investorAddress,
                user.wallet.address
            );

            // Remove from list
            setAccessRequests(prev => ({
                ...prev,
                [request.projectId]: (prev[request.projectId] || []).filter(r => r.id !== request.id)
            }));
        } catch (error) {
            console.error('Error approving access:', error);
        } finally {
            setProcessingRequest(null);
        }
    };

    // Handle reject access
    const handleReject = async (request: AccessRequest) => {
        if (!user?.wallet?.address) return;

        setProcessingRequest(request.id);
        try {
            await rejectAccess(request.id, user.wallet.address);

            // Remove from list
            setAccessRequests(prev => ({
                ...prev,
                [request.projectId]: (prev[request.projectId] || []).filter(r => r.id !== request.id)
            }));
        } catch (error) {
            console.error('Error rejecting access:', error);
        } finally {
            setProcessingRequest(null);
        }
    };

    // Check role - redirect investors
    if (!isLoading && authenticated && userProfile && userProfile.role === 'investor') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-10 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                        <span className="text-5xl">💰</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Investor Account</h1>
                    <p className="text-gray-400 mb-8">
                        This page is for Founders to manage their projects.
                    </p>
                    <Link
                        href="/browse"
                        className="block w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-bold transition-all"
                    >
                        Browse Projects
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Not authenticated
    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <svg
                        className="w-24 h-24 text-purple-500 mx-auto mb-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <h2 className="text-3xl font-bold mb-4 text-white">Connect Your Wallet</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        Connect your wallet to view your projects
                    </p>
                    <button
                        onClick={login}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg font-semibold hover:from-purple-700 hover:to-violet-700 transition-all"
                    >
                        Connect Wallet
                    </button>
                </motion.div>
            </div>
        );
    }

    const modeInfo = getModeIndicator();
    const totalPendingRequests = Object.values(accessRequests).flat().length;

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideUp}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                                    Your Projects
                                </span>
                            </h1>
                            <p className="text-gray-400">
                                Manage your projects and access requests
                            </p>
                        </div>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-xl font-semibold transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Project
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            <div className="text-2xl font-bold text-white">{projects.length}</div>
                            <div className="text-sm text-gray-400">Total Projects</div>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            <div className="text-2xl font-bold text-purple-400">
                                {projects.filter(p => p.isPrivate).length}
                            </div>
                            <div className="text-sm text-gray-400">Private (Encrypted)</div>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            <div className="text-2xl font-bold text-yellow-400">{totalPendingRequests}</div>
                            <div className="text-sm text-gray-400">Pending Requests</div>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{modeInfo.emoji}</span>
                                <span className="text-sm font-medium text-gray-300">{modeInfo.label}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Encryption Mode</div>
                        </div>
                    </div>
                </motion.div>

                {/* Projects List */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="space-y-6"
                >
                    {projects.length === 0 ? (
                        <motion.div
                            variants={staggerItem}
                            className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/50"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                            <p className="text-gray-400 mb-6">Create your first project to get started</p>
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-semibold transition-all hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Your First Project
                            </Link>
                        </motion.div>
                    ) : (
                        projects.map((project) => {
                            const requests = accessRequests[project.id] || [];
                            const isExpanded = expandedProject === project.id;

                            return (
                                <motion.div
                                    key={project.id}
                                    variants={staggerItem}
                                    className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden"
                                >
                                    {/* Project Header */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Link
                                                        href={`/project/${project.id}`}
                                                        className="text-xl font-bold text-white hover:text-purple-400 transition-colors"
                                                    >
                                                        {project.title}
                                                    </Link>
                                                    {project.isPrivate && (
                                                        <EncryptionBadge isEncrypted={true} variant="compact" />
                                                    )}
                                                    {requests.length > 0 && (
                                                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                                                            {requests.length} pending
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <span>{project.category || 'Uncategorized'}</span>
                                                    <span>•</span>
                                                    <span>{formatCurrency(project.fundingGoal || 0)} goal</span>
                                                    <span>•</span>
                                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/project/${project.id}`}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                {project.isPrivate && requests.length > 0 && (
                                                    <button
                                                        onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                                    >
                                                        <svg
                                                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Access Requests (Expandable) */}
                                    <AnimatePresence>
                                        {isExpanded && requests.length > 0 && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-700"
                                            >
                                                <div className="p-6 bg-gray-900/50">
                                                    <h4 className="font-semibold text-white mb-4">Access Requests</h4>
                                                    <div className="space-y-3">
                                                        {requests.map((request) => (
                                                            <div
                                                                key={request.id}
                                                                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                                                            >
                                                                <div>
                                                                    <div className="font-medium text-white">
                                                                        {request.investorAddress.slice(0, 8)}...{request.investorAddress.slice(-6)}
                                                                    </div>
                                                                    {request.message && (
                                                                        <p className="text-sm text-gray-400 mt-1">
                                                                            &ldquo;{request.message}&rdquo;
                                                                        </p>
                                                                    )}
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        {new Date(request.createdAt).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => handleApprove(request)}
                                                                        disabled={processingRequest === request.id}
                                                                        className="px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg font-medium transition-colors disabled:opacity-50"
                                                                    >
                                                                        {processingRequest === request.id ? '...' : 'Approve'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(request)}
                                                                        disabled={processingRequest === request.id}
                                                                        className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg font-medium transition-colors disabled:opacity-50"
                                                                    >
                                                                        {processingRequest === request.id ? '...' : 'Reject'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </div>
        </div>
    );
}
