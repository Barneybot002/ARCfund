/**
 * Homepage - ARCfund Landing Page
 * Features: Hero with parallax, Arcium branding, stats, how it works, and info sections
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArciumBadge from '@/components/ArciumBadge';
import ArciumInfoSection from '@/components/ArciumInfoSection';
import ProjectCard from '@/components/ProjectCard';
import { dummyProjects } from '@/lib/dummy-data';
import { slideUp, staggerContainer, staggerItem, float } from '@/lib/animations';

export default function HomePage() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -75]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="overflow-hidden">
            {/* Hero Section with Parallax */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Parallax Background Elements */}
                <motion.div
                    style={{ y: y1 }}
                    className="absolute inset-0 -z-10"
                >
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
                </motion.div>

                <motion.div
                    style={{ y: y2 }}
                    className="absolute inset-0 -z-10"
                >
                    <div className="absolute top-40 right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
                </motion.div>

                {/* Hero Content */}
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    {/* Arcium Badge - Floating */}
                    <motion.div
                        variants={float}
                        initial="initial"
                        animate="animate"
                        className="flex justify-center mb-8"
                    >
                        <ArciumBadge />
                    </motion.div>

                    {/* Main Title with Gradient Animation */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6"
                    >
                        <span className="block mb-2">
                            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift bg-200%">
                                ARCfund
                            </span>
                        </span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-2xl sm:text-3xl md:text-4xl text-gray-300 mb-4 font-light"
                    >
                        Private Fundraising with{' '}
                        <span className="text-purple-400 font-semibold">Confidential Computing</span>
                    </motion.p>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg sm:text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
                    >
                        Powered by Arcium MXE - Encrypt your pitch, protect your vision, and raise funds with complete privacy
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/browse">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-shadow"
                            >
                                Browse Projects
                            </motion.button>
                        </Link>
                        <Link href="/create">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gray-800 border-2 border-purple-500/50 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors"
                            >
                                Create Private Pitch
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-gray-500"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
                className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-purple-900/10"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div variants={staggerItem} className="text-center">
                            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-3">
                                100%
                            </div>
                            <div className="text-xl text-gray-300 font-semibold mb-2">Private</div>
                            <div className="text-gray-500">End-to-end encryption</div>
                        </motion.div>

                        <motion.div variants={staggerItem} className="text-center">
                            <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-3">
                                MPC
                            </div>
                            <div className="text-xl text-gray-300 font-semibold mb-2">Powered by MPC</div>
                            <div className="text-gray-500">Multi-party computation</div>
                        </motion.div>

                        <motion.div variants={staggerItem} className="text-center">
                            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
                                Solana
                            </div>
                            <div className="text-xl text-gray-300 font-semibold mb-2">Built on Solana</div>
                            <div className="text-gray-500">Fast & reliable</div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
                className="py-20 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div variants={staggerItem} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                                How It Works
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Fundraising reimagined with confidential computing technology
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <motion.div
                            variants={staggerItem}
                            className="relative p-8 bg-gray-800/50 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors group"
                        >
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                1
                            </div>
                            <div className="mb-6">
                                <svg className="w-16 h-16 text-purple-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Create Private Pitch</h3>
                            <p className="text-gray-400">
                                Founders create project pitches and choose to encrypt them with Arcium MXE for complete privacy.
                            </p>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div
                            variants={staggerItem}
                            className="relative p-8 bg-gray-800/50 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors group"
                        >
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                2
                            </div>
                            <div className="mb-6">
                                <svg className="w-16 h-16 text-violet-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Investors Request Access</h3>
                            <p className="text-gray-400">
                                Interested investors browse projects and request access to view encrypted pitches from founders.
                            </p>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div
                            variants={staggerItem}
                            className="relative p-8 bg-gray-800/50 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors group"
                        >
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                3
                            </div>
                            <div className="mb-6">
                                <svg className="w-16 h-16 text-indigo-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Smart Contract Escrow</h3>
                            <p className="text-gray-400">
                                Investments are secured in smart contracts with privacy guarantees powered by Arcium&aposs MPC technology.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Arcium Technology Showcase */}
            <ArciumInfoSection />

            {/* Featured Projects */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
                className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-purple-900/10"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={staggerItem} className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                                Featured Projects
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400">
                            Discover innovative projects seeking funding
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {dummyProjects.slice(0, 3).map((project) => (
                            <motion.div key={project.id} variants={staggerItem}>
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div variants={staggerItem} className="text-center mt-12">
                        <Link href="/browse">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg font-semibold hover:from-purple-700 hover:to-violet-700 transition-all"
                            >
                                View All Projects →
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}
