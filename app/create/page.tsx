/**
 * Create Project Page
 * Form for creating new protected fundraising projects
 * FOUNDER ONLY - Investors are redirected to browse page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import ArciumBadge from '@/components/ArciumBadge';
import EncryptionBadge from '@/components/EncryptionBadge';
import { slideUp, slideLeft } from '@/lib/animations';
import { ProjectCategory } from '@/lib/types';
import { getUserProfile, UserProfile } from '@/lib/user-storage';

export default function CreateProjectPage() {
    const router = useRouter();
    const { ready, authenticated, login } = usePrivy();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!ready) return;

        if (authenticated) {
            const profile = getUserProfile();
            setUserProfile(profile);
        }
        setIsLoading(false);
    }, [ready, authenticated]);

    // Check if user is an investor - redirect them
    if (!isLoading && authenticated && userProfile && userProfile.role === 'investor') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-10 text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 bg-violet-500/20 rounded-2xl flex items-center justify-center">
                        <span className="text-5xl">💰</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Investor Account</h1>
                    <p className="text-gray-400 mb-8">
                        Creating projects is only available for Founders. As an Investor, you can browse and invest in existing projects.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/browse"
                            className="block w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-bold transition-all hover:scale-[1.02]"
                        >
                            Browse Projects
                        </Link>
                        <Link
                            href="/settings"
                            className="block w-full py-3 px-6 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-all"
                        >
                            Switch to Founder in Settings
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pitch: '',
        fundingGoal: '',
        category: ProjectCategory.OTHER,
        isPrivate: false,
        tags: '',
        timeline: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authenticated) {
            login();
            return;
        }

        setIsSubmitting(true);

        // Simulate project creation with Arcium encryption
        setTimeout(() => {
            console.log('Creating project:', formData);
            console.log('Privacy mode:', formData.isPrivate ? 'ENCRYPTED via Arcium MXE' : 'PUBLIC');

            setIsSubmitting(false);
            setSubmitSuccess(true);

            // Redirect after success
            setTimeout(() => {
                router.push('/browse');
            }, 2000);
        }, 2000);
    };

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
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <h2 className="text-3xl font-bold mb-4 text-white">Connect Your Wallet</h2>
                    <p className="text-gray-400 mb-8 max-w-md">
                        You need to connect your wallet to create a project on ARCfund
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

    if (submitSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Project Created!</h2>
                    <p className="text-gray-400 mb-2">
                        Your project has been {formData.isPrivate ? 'encrypted with Arcium MXE and ' : ''}published successfully.
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to browse page...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideUp}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                            Create Your Project
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Launch your fundraising campaign with optional end-to-end encryption powered by Arcium
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial="hidden"
                    animate="visible"
                    variants={slideLeft}
                    onSubmit={handleSubmit}
                    className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-8 space-y-6 backdrop-blur-sm"
                >
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
                            Project Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                            placeholder="Enter your project title"
                        />
                    </div>

                    {/* Short Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
                            Short Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white resize-none"
                            placeholder="Brief description shown on project card"
                        />
                    </div>

                    {/* Full Pitch */}
                    <div>
                        <label htmlFor="pitch" className="block text-sm font-semibold text-gray-300 mb-2">
                            Full Pitch *
                        </label>
                        <textarea
                            id="pitch"
                            name="pitch"
                            required
                            value={formData.pitch}
                            onChange={handleChange}
                            rows={6}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white resize-none"
                            placeholder="Detailed project pitch (will be encrypted if private mode is enabled)"
                        />
                    </div>

                    {/* Funding Goal & Category */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fundingGoal" className="block text-sm font-semibold text-gray-300 mb-2">
                                Funding Goal (USD) *
                            </label>
                            <input
                                type="number"
                                id="fundingGoal"
                                name="fundingGoal"
                                required
                                min="1000"
                                value={formData.fundingGoal}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                                placeholder="e.g., 500000"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-300 mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                            >
                                {Object.values(ProjectCategory).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-semibold text-gray-300 mb-2">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white"
                            placeholder="e.g., DeFi, Privacy, NFT"
                        />
                    </div>

                    {/* Timeline */}
                    <div>
                        <label htmlFor="timeline" className="block text-sm font-semibold text-gray-300 mb-2">
                            Timeline
                        </label>
                        <textarea
                            id="timeline"
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white resize-none"
                            placeholder="e.g., Q1 2024 - Beta Launch, Q2 2024 - Mainnet"
                        />
                    </div>

                    {/* Privacy Toggle */}
                    <div className="p-6 bg-purple-900/20 border-2 border-purple-500/30 rounded-xl">
                        <div className="flex items-start gap-4">
                            <input
                                type="checkbox"
                                id="isPrivate"
                                name="isPrivate"
                                checked={formData.isPrivate}
                                onChange={handleChange}
                                className="mt-1 w-5 h-5 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <div className="flex-1">
                                <label htmlFor="isPrivate" className="font-semibold text-white cursor-pointer flex items-center gap-2">
                                    Make this project private
                                    {formData.isPrivate && <EncryptionBadge isEncrypted={true} variant="compact" showTooltip={false} />}
                                </label>
                                <p className="text-sm text-gray-400 mt-1">
                                    Enable end-to-end encryption via Arcium MXE. Your pitch will be encrypted and only approved investors can view it.
                                </p>
                                {formData.isPrivate && (
                                    <div className="mt-4">
                                        <ArciumBadge />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                {formData.isPrivate ? 'Encrypting & Creating...' : 'Creating Project...'}
                            </>
                        ) : (
                            <>
                                {formData.isPrivate && (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                )}
                                Create Project
                            </>
                        )}
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                        By creating a project, you agree to our terms and conditions
                    </p>
                </motion.form>
            </div>
        </div>
    );
}
