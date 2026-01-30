/**
 * Homepage - ARCfund Landing Page
 * Features: Dynamic hero, trust bar, stats, how it works, why Arcium, featured preview, testimonials
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import ArciumBadge from '@/components/ArciumBadge';
import TrustBar from '@/components/home/TrustBar';
import StatsSection from '@/components/home/StatsSection';
import HowItWorks from '@/components/home/HowItWorks';
import WhyArcium from '@/components/home/WhyArcium';
import FeaturedPreview from '@/components/home/FeaturedPreview';
import Testimonials from '@/components/home/Testimonials';
import { getUserProfile, UserProfile } from '@/lib/user-storage';
import { float } from '@/lib/animations';

export default function HomePage() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -75]);

    const { ready, authenticated, login } = usePrivy();
    const [mounted, setMounted] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        setMounted(true);
        if (authenticated) {
            const profile = getUserProfile();
            setUserProfile(profile);
        }
    }, [authenticated]);

    if (!mounted) return null;

    // Determine CTA button based on auth state
    const renderHeroButton = () => {
        if (!ready) {
            return (
                <div className="px-10 py-5 bg-gray-700/50 rounded-xl font-semibold text-xl animate-pulse">
                    Loading...
                </div>
            );
        }

        if (!authenticated || !userProfile) {
            return (
                <motion.button
                    onClick={() => login()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-bold text-xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all"
                >
                    Connect Wallet
                </motion.button>
            );
        }

        if (userProfile.role === 'investor') {
            return (
                <Link href="/browse">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold text-xl shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 transition-all"
                    >
                        Browse Projects
                    </motion.button>
                </Link>
            );
        }

        // Founder
        return (
            <Link href="/create">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl font-bold text-xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all"
                >
                    Create Private Pitch
                </motion.button>
            </Link>
        );
    };

    // Dynamic subtitle based on user state
    const getHeroSubtitle = () => {
        if (!authenticated || !userProfile) {
            return 'Powered by Arcium MXE - Encrypt your pitch, protect your vision, and raise funds with complete privacy';
        }
        if (userProfile.role === 'investor') {
            return 'Discover innovative projects seeking funding with verified security and privacy';
        }
        return 'Start raising funds with encrypted pitches and complete privacy protection';
    };

    return (
        <div className="overflow-hidden">
            {/* Trust Indicators Bar */}
            <TrustBar />

            {/* Hero Section with Parallax */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                        {getHeroSubtitle()}
                    </motion.p>

                    {/* Dynamic CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex justify-center"
                    >
                        {renderHeroButton()}
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

            {/* Animated Stats Section */}
            <StatsSection />

            {/* How It Works Section */}
            <HowItWorks />

            {/* Why Arcium / Privacy Section */}
            <WhyArcium />

            {/* Featured Projects Preview (only for non-authenticated users) */}
            <FeaturedPreview />

            {/* Testimonials */}
            <Testimonials />

            {/* Final CTA Section */}
            <section className="py-24 px-4 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />

                <div className="max-w-4xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                                Get Started?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            {authenticated && userProfile
                                ? userProfile.role === 'founder'
                                    ? 'Create your first encrypted pitch and start raising funds securely'
                                    : 'Discover innovative projects and invest with confidence'
                                : 'Join ARCfund today and experience the future of private fundraising'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {renderHeroButton()}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer spacer */}
            <div className="h-20" />
        </div>
    );
}
