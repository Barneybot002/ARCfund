/**
 * Your Projects Page - Founders only
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { getUserProfile, UserProfile } from '@/lib/user-storage';
import { formatCurrency } from '@/lib/dummy-data';
import { staggerContainer, staggerItem } from '@/lib/animations';
import Link from 'next/link';

// Mock projects data for founders
const mockProjects = [
    {
        id: 1,
        name: 'Project Alpha',
        description: 'A revolutionary DeFi protocol for cross-chain lending',
        goal: 100000,
        raised: 60000,
        investors: 12,
        accessRequests: 3,
        status: 'Active',
        category: 'DeFi',
        createdAt: '2024-01-05'
    },
    {
        id: 2,
        name: 'Project Beta',
        description: 'Next-generation NFT marketplace with AI curation',
        goal: 200000,
        raised: 50000,
        investors: 8,
        accessRequests: 2,
        status: 'Active',
        category: 'NFT',
        createdAt: '2024-01-10'
    },
    {
        id: 3,
        name: 'Project Gamma',
        description: 'Decentralized gaming platform with play-to-earn mechanics',
        goal: 50000,
        raised: 40000,
        investors: 15,
        accessRequests: 0,
        status: 'Funded',
        category: 'Gaming',
        createdAt: '2023-12-15'
    },
];

export default function YourProjectsPage() {
    const router = useRouter();
    const { ready, authenticated } = usePrivy();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!ready) return;

        if (!authenticated) {
            router.push('/');
            return;
        }

        const profile = getUserProfile();
        if (profile) {
            // Redirect investors to their investments page
            if (profile.role === 'investor') {
                router.push('/your-investments');
                return;
            }
            setUserProfile(profile);
        }
        setIsLoading(false);
    }, [ready, authenticated, router]);

    if (!ready || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!userProfile) {
        return null;
    }

    const totalRaised = mockProjects.reduce((sum, p) => sum + p.raised, 0);
    const totalInvestors = mockProjects.reduce((sum, p) => sum + p.investors, 0);
    const pendingRequests = mockProjects.reduce((sum, p) => sum + p.accessRequests, 0);

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Your Projects</h1>
                        <p className="text-gray-400">Manage your fundraising campaigns</p>
                    </div>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Project
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid sm:grid-cols-4 gap-6 mb-10"
                >
                    <motion.div
                        variants={staggerItem}
                        className="p-5 bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-xl border border-purple-500/30"
                    >
                        <p className="text-sm text-gray-400 mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-white">{mockProjects.length}</p>
                    </motion.div>
                    <motion.div
                        variants={staggerItem}
                        className="p-5 bg-gradient-to-br from-violet-900/30 to-gray-900/50 rounded-xl border border-violet-500/30"
                    >
                        <p className="text-sm text-gray-400 mb-1">Total Raised</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalRaised)}</p>
                    </motion.div>
                    <motion.div
                        variants={staggerItem}
                        className="p-5 bg-gradient-to-br from-indigo-900/30 to-gray-900/50 rounded-xl border border-indigo-500/30"
                    >
                        <p className="text-sm text-gray-400 mb-1">Total Investors</p>
                        <p className="text-3xl font-bold text-white">{totalInvestors}</p>
                    </motion.div>
                    <motion.div
                        variants={staggerItem}
                        className="p-5 bg-gradient-to-br from-pink-900/30 to-gray-900/50 rounded-xl border border-pink-500/30"
                    >
                        <p className="text-sm text-gray-400 mb-1">Pending Requests</p>
                        <p className="text-3xl font-bold text-white">{pendingRequests}</p>
                    </motion.div>
                </motion.div>

                {/* Projects List */}
                {mockProjects.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        {mockProjects.map((project, index) => {
                            const progress = Math.round((project.raised / project.goal) * 100);
                            return (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 p-6 hover:border-purple-500/30 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-white text-xl">{project.name}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Active'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : project.status === 'Funded'
                                                            ? 'bg-purple-500/20 text-purple-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                                <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded text-xs">
                                                    {project.category}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                                            {/* Progress */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-gray-400">
                                                        <span className="text-white font-semibold">{formatCurrency(project.raised)}</span> of {formatCurrency(project.goal)}
                                                    </span>
                                                    <span className="text-purple-400 font-medium">{progress}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all"
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats row */}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <span className="text-gray-500">
                                                    <span className="text-violet-400 font-semibold">{project.investors}</span> investors
                                                </span>
                                                {project.accessRequests > 0 && (
                                                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                                                        {project.accessRequests} access request{project.accessRequests > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 lg:w-40">
                                            <Link
                                                href={`/project/${project.id}`}
                                                className="px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium text-center"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                href={`/project/${project.id}/edit`}
                                                className="px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm font-medium text-center"
                                            >
                                                Edit Project
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                            <span className="text-5xl">🚀</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">No Projects Yet</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Create your first project to start raising funds from investors.
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-bold text-lg transition-all hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Your First Project
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
