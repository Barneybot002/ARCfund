/**
 * Dashboard Page
 * User's projects and investments overview
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import ProjectCard from '@/components/ProjectCard';
import { dummyProjects, formatCurrency } from '@/lib/dummy-data';
import { slideUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function DashboardPage() {
    const { authenticated, login, user } = usePrivy();
    const [activeTab, setActiveTab] = useState<'created' | 'invested'>('created');

    // Mock data - in real app, filter by actual user
    const userProjects = dummyProjects.slice(0, 2);
    const userInvestments = dummyProjects.slice(2, 4);

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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <h2 className="text-3xl font-bold mb-4 text-white">Connect Your Wallet</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        Connect your wallet to view your dashboard and manage your projects
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

    const totalRaised = userProjects.reduce((sum, project) => sum + project.currentFunding, 0);
    const totalInvested = userInvestments.reduce((sum, project) => sum + 50000, 0); // Mock amount

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideUp}
                    className="mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                            Dashboard
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Welcome back, {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 'User'}
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-6 mb-12"
                >
                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-purple-500/30 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Projects Created</p>
                                <p className="text-2xl font-bold text-white">{userProjects.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-purple-500/30 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Raised</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(totalRaised)}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={staggerItem}
                        className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-purple-500/30 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Total Invested</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-700 mb-8">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === 'created'
                                ? 'text-purple-400 border-b-2 border-purple-400'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        My Projects ({userProjects.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('invested')}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === 'invested'
                                ? 'text-purple-400 border-b-2 border-purple-400'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        My Investments ({userInvestments.length})
                    </button>
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'created' ? (
                        <div>
                            {userProjects.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {userProjects.map((project) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <svg
                                        className="w-24 h-24 text-gray-600 mx-auto mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <p className="text-xl text-gray-400 mb-6">No projects yet</p>
                                    <a
                                        href="/create"
                                        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                                    >
                                        Create Your First Project
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {userInvestments.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {userInvestments.map((project) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <svg
                                        className="w-24 h-24 text-gray-600 mx-auto mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="text-xl text-gray-400 mb-6">No investments yet</p>
                                    <a
                                        href="/browse"
                                        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                                    >
                                        Browse Projects
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
