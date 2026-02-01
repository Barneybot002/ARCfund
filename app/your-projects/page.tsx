/**
 * Your Projects Page - Founders only
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { getUserProfile, UserProfile } from '@/lib/user-storage';
import * as projectStorage from '@/lib/project-storage';
import { PublicKey } from '@solana/web3.js';
import { formatCurrency } from '@/lib/dummy-data';
import { staggerContainer, staggerItem } from '@/lib/animations';
import Link from 'next/link';

function AccessRequestList({ projectId, refresh }: { projectId: string; refresh: () => void }) {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const list = await projectStorage.getAccessRequests(projectId);
                if (!mounted) return;
                setRequests(list || []);
            } catch (err: any) {
                console.error('Failed to load access requests:', err);
                if (mounted) setError(err?.message || String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [projectId]);

    const handleApprove = async (investorAddress: string) => {
        try {
            const founder = getUserProfile();
            if (!founder) throw new Error('Missing founder profile');
            await projectStorage.approveAccess(projectId, new PublicKey(investorAddress), new PublicKey(founder.walletAddress));
            refresh();
            setRequests((r) => r.filter((x) => x.account.investor.toBase58() !== investorAddress));
        } catch (err) {
            console.error(err);
            setError('Failed to approve request');
        }
    };

    const handleDeny = async (investorAddress: string) => {
        try {
            const founder = getUserProfile();
            if (!founder) throw new Error('Missing founder profile');
            await projectStorage.denyAccess(projectId, new PublicKey(investorAddress), new PublicKey(founder.walletAddress));
            refresh();
            setRequests((r) => r.filter((x) => x.account.investor.toBase58() !== investorAddress));
        } catch (err) {
            console.error(err);
            setError('Failed to deny request');
        }
    };

    if (loading) return <div className="text-sm text-gray-400">Loading requests…</div>;
    if (error) return <div className="text-sm text-red-400">{error}</div>;
    if (!requests || requests.length === 0) return <div className="text-sm text-gray-400">No pending requests</div>;

    return (
        <div className="space-y-3">
            {requests.map((r) => {
                const investor = r.account.investor?.toBase58 ? r.account.investor.toBase58() : String(r.account.investor);
                return (
                    <div key={investor} className="flex items-center justify-between bg-gray-900/40 p-3 rounded">
                        <div>
                            <div className="text-sm text-white">{investor}</div>
                            <div className="text-xs text-gray-400">Requested at {new Date(Number(r.account.requestedAt ?? Date.now())).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleApprove(investor)} className="px-3 py-1 bg-green-600/80 text-white rounded">Approve</button>
                            <button onClick={() => handleDeny(investor)} className="px-3 py-1 bg-red-600/80 text-white rounded">Deny</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

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
    const [projects, setProjects] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ready) return;

        if (!authenticated) {
            router.push('/');
            return;
        }
        const profile = getUserProfile();
        if (!profile) return;
        if (profile.role === 'investor') {
            router.push('/your-investments');
            return;
        }

        setUserProfile(profile);

        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const founderPk = new PublicKey(profile.walletAddress);
                const list = await projectStorage.getProjectsByFounder(founderPk);
                setProjects(list || []);
            } catch (err: any) {
                console.error('Failed to load founder projects:', err);
                setError(err?.message || String(err));
            } finally {
                setIsLoading(false);
            }
        })();
    }, [ready, authenticated, router]);

    if (!ready || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!userProfile) return null;

    const totalRaised = projects.reduce((sum, p) => sum + (p.account?.currentFunding ?? 0), 0);
    const totalInvestors = projects.reduce((sum, p) => sum + 0, 0);
    const pendingRequests = projects.reduce((sum, p) => {
        const reqs = p.account?.accessRequestsCount ?? 0;
        return sum + reqs;
    }, 0);

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
                        <p className="text-3xl font-bold text-white">{projects.length}</p>
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
                {projects.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        {projects.map((p, index) => {
                            const project = p.account;
                            const progress = project?.fundingGoal ? Math.round(((project.currentFunding ?? 0) / project.fundingGoal) * 100) : 0;
                            return (
                                <motion.div
                                    key={p.pubkey?.toString?.() ?? index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 p-6 hover:border-purple-500/30 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-white text-xl">{project?.projectId ?? 'Unnamed'}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${project?.status === 'Active'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : project?.status === 'Funded'
                                                            ? 'bg-purple-500/20 text-purple-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {project?.status ?? 'Active'}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4">{project?.description ?? ''}</p>

                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-gray-400">
                                                        <span className="text-white font-semibold">{formatCurrency(project?.currentFunding ?? 0)}</span> of {formatCurrency(project?.fundingGoal ?? 0)}
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

                                            {/* Access requests */}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <span className="text-gray-500">
                                                    <span className="text-violet-400 font-semibold">{project?.investorsCount ?? 0}</span> investors
                                                </span>
                                                {project?.accessRequestsCount > 0 && (
                                                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                                                        {project.accessRequestsCount} access request{project.accessRequestsCount > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 lg:w-40">
                                            <Link
                                                href={`/project/${project?.projectId}`}
                                                className="px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium text-center"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                href={`/project/${project?.projectId}/edit`}
                                                className="px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm font-medium text-center"
                                            >
                                                Edit Project
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Access request actions */}
                                    {project?.accessRequestsCount > 0 && (
                                        <div className="mt-4 border-t border-gray-800 pt-4">
                                            <h4 className="text-sm text-gray-300 mb-2">Pending Access Requests</h4>
                                            <AccessRequestList projectId={project?.projectId} refresh={() => {
                                                (async () => {
                                                    try {
                                                        const founderPk = new PublicKey(userProfile!.walletAddress);
                                                        const list = await projectStorage.getProjectsByFounder(founderPk);
                                                        setProjects(list || []);
                                                    } catch (err) {
                                                        console.warn(err);
                                                    }
                                                })();
                                            }} />
                                        </div>
                                    )}
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
