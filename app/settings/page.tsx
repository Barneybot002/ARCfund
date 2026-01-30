/**
 * Settings Page - User profile and preferences
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { getUserProfile, updateUserProfile, UserProfile, UserRole } from '@/lib/user-storage';

export default function SettingsPage() {
    const router = useRouter();
    const { ready, authenticated, user } = usePrivy();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>('investor');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Track if role changed (for reload)
    const [originalRole, setOriginalRole] = useState<UserRole>('investor');

    useEffect(() => {
        if (!ready) return;

        if (!authenticated) {
            router.push('/');
            return;
        }

        const profile = getUserProfile();
        if (profile) {
            setUserProfile(profile);
            setName(profile.name);
            setRole(profile.role);
            setOriginalRole(profile.role);
        }
        setIsLoading(false);
    }, [ready, authenticated, router]);

    const handleSave = async () => {
        if (!name.trim()) {
            setSaveMessage({ type: 'error', text: 'Please enter your name' });
            return;
        }

        setIsSaving(true);
        setSaveMessage(null);

        try {
            const updated = updateUserProfile({ name: name.trim(), role });
            if (updated) {
                setUserProfile(updated);

                // Check if role changed
                const roleChanged = originalRole !== role;

                if (roleChanged) {
                    setSaveMessage({ type: 'success', text: 'Role changed! Redirecting to dashboard...' });

                    // Wait a moment then reload the page to update all components
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                } else {
                    setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });

                    // Clear message after 3 seconds
                    setTimeout(() => setSaveMessage(null), 3000);
                }
            }
        } catch {
            setSaveMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (!ready || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Please complete your profile setup first.</p>
            </div>
        );
    }

    const memberSince = new Date(userProfile.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    const roleChanged = originalRole !== role;

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your profile and preferences</p>
                </motion.div>

                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 overflow-hidden mb-6"
                >
                    <div className="p-6 border-b border-gray-700/50">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span>👤</span> Profile Information
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Wallet Address (readonly) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Wallet Address
                            </label>
                            <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <code className="text-gray-300 font-mono text-sm truncate">
                                    {user?.wallet?.address}
                                </code>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-3">
                                Your Role
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('founder')}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${role === 'founder'
                                        ? 'border-purple-500 bg-purple-500/15'
                                        : 'border-gray-700/50 hover:border-gray-600 bg-gray-800/40'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🚀</span>
                                        <div>
                                            <p className={`font-bold ${role === 'founder' ? 'text-white' : 'text-gray-300'}`}>
                                                Founder
                                            </p>
                                            <p className="text-xs text-gray-500">Create & manage projects</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRole('investor')}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${role === 'investor'
                                        ? 'border-violet-500 bg-violet-500/15'
                                        : 'border-gray-700/50 hover:border-gray-600 bg-gray-800/40'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">💰</span>
                                        <div>
                                            <p className={`font-bold ${role === 'investor' ? 'text-white' : 'text-gray-300'}`}>
                                                Investor
                                            </p>
                                            <p className="text-xs text-gray-500">Discover & invest</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                            {roleChanged && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-amber-400 mt-3 flex items-center gap-1"
                                >
                                    ⚠️ Role change will reload the page to update navigation and dashboard
                                </motion.p>
                            )}
                            {!roleChanged && (
                                <p className="text-xs text-gray-500 mt-3">
                                    💡 Changing your role will update your dashboard and navigation
                                </p>
                            )}
                        </div>

                        {/* Member Since */}
                        <div className="pt-4 border-t border-gray-700/50">
                            <p className="text-sm text-gray-500">
                                Member since {memberSince}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Save Button & Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between gap-4"
                >
                    <AnimatePresence>
                        {saveMessage && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className={`text-sm font-medium ${saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                                    }`}
                            >
                                {saveMessage.text}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="ml-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : roleChanged ? 'Save & Reload' : 'Save Changes'}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
