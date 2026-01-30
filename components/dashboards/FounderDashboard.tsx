/**
 * Founder Dashboard Component
 * Shows projects overview, access requests, notifications, and quick actions
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { dummyProjects, formatCurrency } from '@/lib/dummy-data';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { UserProfile } from '@/lib/user-storage';

interface FounderDashboardProps {
    userProfile: UserProfile;
}

// Mock project data for founders
const mockProjects = [
    {
        id: 1,
        name: 'Project Alpha',
        goal: 100000,
        raised: 60000,
        accessRequests: 3,
        newOffers: 0,
    },
    {
        id: 2,
        name: 'Project Beta',
        goal: 200000,
        raised: 50000,
        accessRequests: 2,
        newOffers: 1,
    },
    {
        id: 3,
        name: 'Project Gamma',
        goal: 50000,
        raised: 40000,
        accessRequests: 0,
        newOffers: 1,
    },
];

const mockNotifications = [
    { id: 1, message: 'Investor X requested access to Project Alpha', time: '1h ago', icon: '👤' },
    { id: 2, message: 'New offer received on Project Gamma', time: '3h ago', icon: '💰' },
    { id: 3, message: 'Investor Y viewed Project Beta', time: '5h ago', icon: '👁️' },
    { id: 4, message: 'Project Alpha reached 60% funding', time: '1d ago', icon: '🎉' },
];

export default function FounderDashboard({ userProfile }: FounderDashboardProps) {
    const hasProjects = mockProjects.length > 0;
    const totalRaised = mockProjects.reduce((sum, p) => sum + p.raised, 0);
    const totalRequests = mockProjects.reduce((sum, p) => sum + p.accessRequests, 0);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Empty state for new founders
    if (!hasProjects) {
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
                            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                                {userProfile.name}
                            </span>
                            <span className="text-white">! 👋</span>
                        </h1>
                        <p className="text-xl text-gray-400">Founder Dashboard</p>
                    </motion.div>

                    {/* Empty State */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                            <span className="text-5xl">🚀</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Get Started</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            You haven&apos;t created any projects yet. Create your first project to start raising funds!
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Your First Project
                        </Link>
                    </motion.div>

                    {/* Tips */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 bg-gradient-to-br from-purple-900/20 to-gray-900/50 rounded-xl border border-purple-500/20 p-8"
                    >
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span>💡</span> Tips for a Successful Project
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-400 font-bold">1</span>
                                </div>
                                <div>
                                    <p className="font-medium text-white">Compelling Description</p>
                                    <p className="text-sm text-gray-400">Write a clear and engaging project description</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-400 font-bold">2</span>
                                </div>
                                <div>
                                    <p className="font-medium text-white">Realistic Goals</p>
                                    <p className="text-sm text-gray-400">Set achievable funding milestones</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-400 font-bold">3</span>
                                </div>
                                <div>
                                    <p className="font-medium text-white">Updated Pitch Deck</p>
                                    <p className="text-sm text-gray-400">Keep your materials current and polished</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Full dashboard with projects
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
                        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                            {userProfile.name}
                        </span>
                        <span className="text-white">! 👋</span>
                    </h1>
                    <p className="text-xl text-gray-400">Founder Dashboard</p>
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
                        className="p-6 bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-xl border border-purple-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📁</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Active Projects</p>
                                <p className="text-3xl font-bold text-white">{mockProjects.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-violet-900/30 to-gray-900/50 rounded-xl border border-violet-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Raised</p>
                                <p className="text-3xl font-bold text-white">{formatCurrency(totalRaised)}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-indigo-900/30 to-gray-900/50 rounded-xl border border-indigo-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📩</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Pending Requests</p>
                                <p className="text-3xl font-bold text-white">{totalRequests}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Your Projects */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 overflow-hidden"
                        >
                            <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>📁</span> Your Projects
                                </h2>
                                <Link href="/your-projects" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                    Manage All →
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-700/50">
                                {mockProjects.map((project) => {
                                    const progress = Math.round((project.raised / project.goal) * 100);
                                    return (
                                        <div key={project.id} className="p-5 hover:bg-gray-800/30 transition-colors">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <p className="font-semibold text-white">{project.name}</p>
                                                    <p className="text-sm text-gray-400">
                                                        {formatCurrency(project.goal)} goal • {progress}% funded
                                                    </p>
                                                </div>
                                                <Link
                                                    href={`/project/${project.id}`}
                                                    className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 text-sm text-gray-300 rounded-lg transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>

                                            {/* Badges */}
                                            <div className="flex items-center gap-2">
                                                {project.accessRequests > 0 && (
                                                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium">
                                                        {project.accessRequests} access request{project.accessRequests > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                                {project.newOffers > 0 && (
                                                    <span className="px-2.5 py-1 bg-green-500/20 text-green-300 text-xs rounded-full font-medium">
                                                        {project.newOffers} new offer{project.newOffers > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                <span>⚡</span> Quick Actions
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Link
                                    href="/create"
                                    className="p-5 bg-gradient-to-br from-purple-600/20 to-gray-900/50 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
                                >
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">➕</div>
                                    <p className="font-bold text-white">Create New Project</p>
                                    <p className="text-sm text-gray-400">Launch a new funding campaign</p>
                                </Link>
                                <Link
                                    href="/your-projects"
                                    className="p-5 bg-gradient-to-br from-violet-600/20 to-gray-900/50 rounded-xl border border-violet-500/30 hover:border-violet-400/50 transition-all group"
                                >
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
                                    <p className="font-bold text-white">Manage Access Requests</p>
                                    <p className="text-sm text-gray-400">Review pending investor requests</p>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar - Notifications */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 overflow-hidden"
                        >
                            <div className="p-5 border-b border-gray-700/50">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>🔔</span> Notifications
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-700/50 max-h-[400px] overflow-y-auto">
                                {mockNotifications.map((notification) => (
                                    <div key={notification.id} className="p-4 hover:bg-gray-800/30 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">{notification.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-300">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-700/50">
                                <button className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                    View All Notifications
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
