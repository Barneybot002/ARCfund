/**
 * Profile Setup Modal - First-time user onboarding
 * Beautiful modal for name and role selection after wallet connection
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole, saveUserProfile } from '@/lib/user-storage';

interface ProfileSetupModalProps {
    isOpen: boolean;
    walletAddress: string;
    onComplete: (name: string, role: UserRole) => void;
}

export default function ProfileSetupModal({
    isOpen,
    walletAddress,
    onComplete,
}: ProfileSetupModalProps) {
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!role) {
            setError('Please select your role');
            return;
        }

        setIsSubmitting(true);

        try {
            saveUserProfile({
                name: name.trim(),
                role,
                walletAddress,
            });
            onComplete(name.trim(), role);
        } catch {
            setError('Failed to save profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-lg"
                    >
                        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
                            {/* Decorative gradient bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600" />

                            {/* Background glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />

                            <div className="relative p-8 md:p-10">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                        className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                                    >
                                        <span className="text-4xl">🎉</span>
                                    </motion.div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-3xl font-bold text-white mb-2"
                                    >
                                        Welcome to ARCfund!
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-gray-400"
                                    >
                                        Let&apos;s set up your profile
                                    </motion.p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Input */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all text-lg"
                                            autoFocus
                                        />
                                    </motion.div>

                                    {/* Role Selection */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                                            I am a...
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Founder Option */}
                                            <button
                                                type="button"
                                                onClick={() => setRole('founder')}
                                                className={`relative p-5 rounded-xl border-2 transition-all duration-300 group ${role === 'founder'
                                                        ? 'border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-500/20'
                                                        : 'border-gray-700/50 hover:border-gray-600 bg-gray-800/40 hover:bg-gray-800/60'
                                                    }`}
                                            >
                                                {role === 'founder' && (
                                                    <motion.div
                                                        layoutId="roleIndicator"
                                                        className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                                                    >
                                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </motion.div>
                                                )}
                                                <div className="text-4xl mb-3">🚀</div>
                                                <p className={`font-bold text-lg ${role === 'founder' ? 'text-white' : 'text-gray-200'}`}>
                                                    Founder
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">I want to raise funds</p>
                                            </button>

                                            {/* Investor Option */}
                                            <button
                                                type="button"
                                                onClick={() => setRole('investor')}
                                                className={`relative p-5 rounded-xl border-2 transition-all duration-300 group ${role === 'investor'
                                                        ? 'border-violet-500 bg-violet-500/15 shadow-lg shadow-violet-500/20'
                                                        : 'border-gray-700/50 hover:border-gray-600 bg-gray-800/40 hover:bg-gray-800/60'
                                                    }`}
                                            >
                                                {role === 'investor' && (
                                                    <motion.div
                                                        layoutId="roleIndicator"
                                                        className="absolute top-3 right-3 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center"
                                                    >
                                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </motion.div>
                                                )}
                                                <div className="text-4xl mb-3">💰</div>
                                                <p className={`font-bold text-lg ${role === 'investor' ? 'text-white' : 'text-gray-200'}`}>
                                                    Investor
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">I want to invest</p>
                                            </button>
                                        </div>
                                    </motion.div>

                                    {/* Error Message */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                                            >
                                                <p className="text-red-400 text-sm text-center">{error}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit Button */}
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        type="submit"
                                        disabled={isSubmitting || !name.trim() || !role}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-bold text-lg text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Setting up...
                                            </span>
                                        ) : (
                                            'Complete Setup'
                                        )}
                                    </motion.button>
                                </form>

                                {/* Footer note */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-center text-sm text-gray-500 mt-6"
                                >
                                    You can change these settings anytime
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
