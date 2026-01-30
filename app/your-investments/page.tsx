/**
 * Your Investments Page - Investor only
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

// Mock investment data
const mockInvestments = [
    {
        id: 1,
        name: 'Project Alpha',
        description: 'A revolutionary DeFi protocol for cross-chain lending',
        amount: 50000,
        equity: '10%',
        status: 'Active',
        category: 'DeFi',
        date: '2024-01-15'
    },
    {
        id: 2,
        name: 'Project Beta',
        description: 'Next-generation NFT marketplace with AI curation',
        amount: 100000,
        equity: '15%',
        status: 'Active',
        category: 'NFT',
        date: '2024-01-10'
    },
    {
        id: 3,
        name: 'Project Gamma',
        description: 'Decentralized gaming platform with play-to-earn mechanics',
        amount: 50000,
        equity: '8%',
        status: 'Pending Approval',
        category: 'Gaming',
        date: '2024-01-20'
    },
    {
        id: 4,
        name: 'Project Delta',
        description: 'Privacy-focused social network on blockchain',
        amount: 80000,
        equity: '12%',
        status: 'Active',
        category: 'Social',
        date: '2023-12-20'
    },
];

export default function YourInvestmentsPage() {
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
            // Redirect founders to their projects page
            if (profile.role === 'founder') {
                router.push('/your-projects');
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

    const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const activeCount = mockInvestments.filter(inv => inv.status === 'Active').length;

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Your Investments</h1>
                    <p className="text-gray-400">Track and manage your portfolio</p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid sm:grid-cols-3 gap-6 mb-10"
                >
                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-violet-900/30 to-gray-900/50 rounded-xl border border-violet-500/30"
                    >
                        <p className="text-sm text-gray-400 mb-1">Total Invested</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalInvested)}</p>
                    </motion.div>
                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-xl border border-purple-500/30"
                    >
                        <p className="text-sm text-gray-400 mb-1">Active Investments</p>
                        <p className="text-3xl font-bold text-white">{activeCount}</p>
                    </motion.div>
                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-indigo-900/30 to-gray-900/50 rounded-xl border border-indigo-500/30"
                    >
                        <p className="text-sm text-gray-400 mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-white">{mockInvestments.length}</p>
                    </motion.div>
                </motion.div>

                {/* Investments List */}
                {mockInvestments.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 overflow-hidden"
                    >
                        <div className="p-5 border-b border-gray-700/50">
                            <h2 className="text-lg font-bold text-white">All Investments</h2>
                        </div>
                        <div className="divide-y divide-gray-700/50">
                            {mockInvestments.map((investment, index) => (
                                <motion.div
                                    key={investment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="p-6 hover:bg-gray-800/30 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-white text-lg">{investment.name}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${investment.status === 'Active'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {investment.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3">{investment.description}</p>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <span className="text-gray-500">
                                                    <span className="text-violet-400 font-semibold">{formatCurrency(investment.amount)}</span> invested
                                                </span>
                                                <span className="text-gray-500">
                                                    <span className="text-purple-400 font-semibold">{investment.equity}</span> equity
                                                </span>
                                                <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded text-xs">
                                                    {investment.category}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/project/${investment.id}`}
                                            className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                                        >
                                            View Project →
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                            <span className="text-5xl">💼</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">No Investments Yet</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Start building your portfolio by exploring and investing in exciting projects.
                        </p>
                        <Link
                            href="/browse"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-bold text-lg transition-all hover:scale-105"
                        >
                            Browse Projects
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
