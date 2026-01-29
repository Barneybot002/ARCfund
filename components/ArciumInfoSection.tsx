/**
 * ArciumInfoSection - Dedicated section explaining Arcium technology
 * Shows encryption visualization and links to documentation
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ArciumBadge from './ArciumBadge';
import { slideUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function ArciumInfoSection() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-900/20 to-transparent"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div variants={staggerItem} className="text-center mb-12">
                    <ArciumBadge className="mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                            Confidential Computing
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        ARCfund leverages Arcium&aposs Multi-Party Computation (MPC) technology to enable
                        completely private fundraising while maintaining full transparency and security.
                    </p>
                </motion.div>

                {/* Feature Grid */}
                <motion.div
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-8 mb-12"
                >
                    {/* Feature 1 */}
                    <motion.div variants={staggerItem} className="p-6 bg-gray-800/50 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">Private Pitches</h3>
                        <p className="text-gray-400">
                            Founders can keep their project details confidential while still showcasing to potential investors.
                        </p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div variants={staggerItem} className="p-6 bg-gray-800/50 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">Encrypted Data</h3>
                        <p className="text-gray-400">
                            All sensitive data is encrypted through Arcium MXE nodes, never exposed in plaintext.
                        </p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div variants={staggerItem} className="p-6 bg-gray-800/50 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">Controlled Access</h3>
                        <p className="text-gray-400">
                            Investors request access, founders approve, and decryption happens only for authorized parties.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Encryption Flow Visualization */}
                <motion.div
                    variants={slideUp}
                    className="p-8 bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-2xl border border-purple-500/30 backdrop-blur-sm"
                >
                    <h3 className="text-2xl font-bold mb-6 text-center text-white">
                        How It Works
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                1
                            </div>
                            <h4 className="font-semibold mb-2 text-white">Founder Encrypts</h4>
                            <p className="text-sm text-gray-400">
                                Project pitch is encrypted client-side using Arcium MXE
                            </p>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:flex items-center justify-center">
                            <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                2
                            </div>
                            <h4 className="font-semibold mb-2 text-white">MPC Processing</h4>
                            <p className="text-sm text-gray-400">
                                Arcium nodes process data without decryption
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center my-6">
                        <svg className="w-12 h-12 text-purple-500 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            3
                        </div>
                        <h4 className="font-semibold mb-2 text-white">Investor Decrypts</h4>
                        <p className="text-sm text-gray-400">
                            Only approved investors receive decryption keys
                        </p>
                    </div>
                </motion.div>

                {/* Learn More */}
                <motion.div variants={slideUp} className="text-center mt-12">
                    <a
                        href="https://docs.arcium.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors duration-300"
                    >
                        <span>Learn More About Arcium</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </motion.section>
    );
}
