/**
 * Investor Dashboard Component
 * Shows investment overview, portfolio, activity, and recommendations
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import { dummyProjects, formatCurrency } from '@/lib/dummy-data';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { UserProfile } from '@/lib/user-storage';

interface InvestorDashboardProps {
    userProfile: UserProfile;
}

// Mock investment data
const mockInvestments = [
    { id: 1, name: 'Project Alpha', amount: 50000, equity: '10%', status: 'Active' },
    { id: 2, name: 'Project Beta', amount: 100000, equity: '15%', status: 'Active' },
    { id: 3, name: 'Project Gamma', amount: 50000, equity: '8%', status: 'Pending Approval' },
];

const mockActivity = [
    { id: 1, message: 'New project available in DeFi category', time: '2h ago', icon: '🔔' },
    { id: 2, message: 'Project Beta updated their pitch deck', time: '5h ago', icon: '📄' },
    { id: 3, message: 'Access granted to Project Delta', time: '1d ago', icon: '✅' },
];

export default function InvestorDashboard({ userProfile }: InvestorDashboardProps) {
    const hasInvestments = mockInvestments.length > 0;
    const recommendedProjects = dummyProjects.slice(0, 3);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Empty state for new investors
    if (!hasInvestments) {
        return (
            <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="text-white">{getGreeting()}, </span>
                            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                {userProfile.name}
                            </span>
                            <span className="text-white">! 👋</span>
                        </h1>
                        <p className="text-xl text-gray-400">Investor Dashboard</p>
                    </motion.div>

                    {/* Empty State */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                            <span className="text-5xl">💰</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Start Investing</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            You haven&apos;t made any investments yet. Browse projects to discover amazing opportunities!
                        </p>
                        <Link
                            href="/browse"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Browse Projects
                        </Link>
                    </motion.div>

                    {/* Featured Projects */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>🌟</span> Featured Projects
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {recommendedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Full dashboard with investments
    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        <span className="text-white">{getGreeting()}, </span>
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            {userProfile.name}
                        </span>
                        <span className="text-white">! 👋</span>
                    </h1>
                    <p className="text-xl text-gray-400">Investor Dashboard</p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-6 mb-10"
                >
                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-violet-900/30 to-gray-900/50 rounded-xl border border-violet-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💵</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Invested</p>
                                <p className="text-3xl font-bold text-white">{formatCurrency(200000)}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-xl border border-purple-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Active Deals</p>
                                <p className="text-3xl font-bold text-white">5</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-indigo-900/30 to-gray-900/50 rounded-xl border border-indigo-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Pending Requests</p>
                                <p className="text-3xl font-bold text-white">3</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Your Investments */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 overflow-hidden"
                        >
                            <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>💼</span> Your Investments
                                </h2>
                                <Link href="/your-investments" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                                    View All →
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-700/50">
                                {mockInvestments.map((investment) => (
                                    <div key={investment.id} className="p-5 hover:bg-gray-800/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-white">{investment.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {formatCurrency(investment.amount)} invested • {investment.equity} equity
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${investment.status === 'Active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {investment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recommended Projects */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>🔍</span> Recommended For You
                                </h2>
                                <Link href="/browse" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                                    Browse All →
                                </Link>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                {recommendedProjects.slice(0, 2).map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 overflow-hidden"
                        >
                            <div className="p-5 border-b border-gray-700/50">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>🔔</span> Recent Activity
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-700/50">
                                {mockActivity.map((activity) => (
                                    <div key={activity.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">{activity.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-300">{activity.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Action */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link
                                href="/browse"
                                className="block p-6 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-xl border border-violet-500/30 hover:border-violet-400/50 transition-all group"
                            >
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔍</div>
                                <p className="font-bold text-white mb-1">Discover Projects</p>
                                <p className="text-sm text-gray-400">Find your next investment opportunity</p>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
