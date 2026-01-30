/**
 * Dashboard Page - Routes to role-specific dashboard
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import InvestorDashboard from '@/components/dashboards/InvestorDashboard';
import FounderDashboard from '@/components/dashboards/FounderDashboard';
import { getUserProfile, UserProfile } from '@/lib/user-storage';

export default function DashboardPage() {
    const router = useRouter();
    const { ready, authenticated, login } = usePrivy();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!ready) return;

        if (!authenticated) {
            setIsLoading(false);
            return;
        }

        // Load user profile
        const profile = getUserProfile();
        if (profile && profile.setupComplete) {
            setUserProfile(profile);
        }
        setIsLoading(false);
    }, [ready, authenticated]);

    // Loading state
    if (!ready || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - show connect prompt
    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-10 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h1>
                    <p className="text-gray-400 mb-8">
                        Connect your wallet to access your personalized dashboard
                    </p>
                    <button
                        onClick={() => login()}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30"
                    >
                        Connect Wallet
                    </button>
                </motion.div>
            </div>
        );
    }

    // No profile yet - this shouldn't happen if header modal works, but handle it
    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-10 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center">
                        <span className="text-4xl">👋</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Complete Your Profile</h1>
                    <p className="text-gray-400 mb-8">
                        Please complete your profile setup to access the dashboard. Refresh the page to see the setup modal.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-bold text-lg transition-all hover:scale-[1.02]"
                    >
                        Refresh Page
                    </button>
                </motion.div>
            </div>
        );
    }

    // Render role-specific dashboard
    if (userProfile.role === 'investor') {
        return <InvestorDashboard userProfile={userProfile} />;
    }

    return <FounderDashboard userProfile={userProfile} />;
}
