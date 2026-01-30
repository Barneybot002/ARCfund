/**
 * Featured Preview - Blurred project cards for non-authenticated users
 */

'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';

const mockProjects = [
    { name: 'DeFi Protocol', category: 'DeFi', raised: '$250K', progress: 75 },
    { name: 'NFT Marketplace', category: 'NFT', raised: '$180K', progress: 60 },
    { name: 'Gaming Platform', category: 'Gaming', raised: '$320K', progress: 85 },
];

export default function FeaturedPreview() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { authenticated, login } = usePrivy();

    // Don't show this section if user is authenticated
    if (authenticated) return null;

    return (
        <section ref={ref} className="py-20 px-4 relative">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        <span className="text-2xl mr-2">🌟</span>
                        Featured <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Projects</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Connect your wallet to explore innovative projects
                    </p>
                </motion.div>

                {/* Blurred Project Cards */}
                <div className="relative">
                    <div className="grid md:grid-cols-3 gap-6">
                        {mockProjects.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                                className="relative"
                            >
                                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-6 blur-[2px]">
                                    <div className="aspect-video bg-gray-700/50 rounded-lg mb-4" />
                                    <div className="h-4 bg-gray-700/50 rounded mb-2 w-3/4" />
                                    <div className="h-3 bg-gray-700/30 rounded mb-4 w-1/2" />
                                    <div className="flex items-center justify-between">
                                        <div className="h-3 bg-gray-700/30 rounded w-1/4" />
                                        <div className="h-3 bg-purple-500/30 rounded w-1/4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Overlay CTA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-gray-900/80 to-transparent"
                    >
                        <div className="text-center px-6 py-8 bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Unlock Project Access</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-xs">
                                Connect your wallet to view detailed project information and investment opportunities
                            </p>
                            <button
                                onClick={() => login()}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                            >
                                Connect to View Projects
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
