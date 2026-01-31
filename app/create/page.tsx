/**
 * Create Project Page
 * ===================
 * 
 * Form for creating new fundraising projects with optional Arcium encryption.
 * 
 * FEATURES:
 * - Role-based access (founders only)
 * - Optional privacy mode with end-to-end encryption
 * - Real-time encryption status feedback
 * - Integration with Arcium MXE (or simulation mode)
 * 
 * FOUNDER ONLY - Investors are redirected to browse page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import ArciumBadge from '@/components/ArciumBadge';
import EncryptionBadge from '@/components/EncryptionBadge';
import { slideUp, slideLeft } from '@/lib/animations';
import { ProjectCategory } from '@/lib/types';
import { getUserProfile, UserProfile } from '@/lib/user-storage';
import {
    createProject,
    isSimulationMode,
    getModeIndicator,
    EncryptionState,
} from '@/lib/project-storage';

export default function CreateProjectPage() {
    const router = useRouter();
    const { ready, authenticated, login, user } = usePrivy();
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
    const [encryptionState, setEncryptionState] = useState<EncryptionState>({ status: 'idle' });
    const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authenticated || !user?.wallet?.address) {
            login();
            return;
        }

        setIsSubmitting(true);
        setEncryptionState({ status: 'encrypting', message: 'Preparing...' });

        try {
            const result = await createProject(
                {
                    title: formData.title,
                    description: formData.description,
                    pitch: formData.pitch,
                    fundingGoal: parseFloat(formData.fundingGoal) || 0,
                    category: formData.category,
                    isPrivate: formData.isPrivate,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                    timeline: formData.timeline,
                },
                user.wallet.address,
                (state) => setEncryptionState(state)
            );

            if (result.success && result.project) {
                setCreatedProjectId(result.project.id);
                setSubmitSuccess(true);

                // Redirect after success
                setTimeout(() => {
                    router.push('/your-projects');
                }, 2500);
            } else {
                setEncryptionState({
                    status: 'error',
                    error: result.error || 'Failed to create project'
                });
            }
        } catch (error) {
            console.error('Project creation error:', error);
            setEncryptionState({
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setIsSubmitting(false);
        }
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
        const modeInfo = getModeIndicator();

        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-lg"
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
                    <p className="text-gray-400 mb-4">
                        {formData.isPrivate
                            ? `Your project pitch has been encrypted ${modeInfo.emoji} and stored securely.`
                            : 'Your project has been published successfully.'}
                    </p>

                    {formData.isPrivate && (
                        <div className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-lg">{modeInfo.emoji}</span>
                                <span className="font-semibold text-purple-300">{modeInfo.label}</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                {modeInfo.description}
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-gray-500">Redirecting to your projects...</p>
                </motion.div>
            </div>
        );
    }

    const modeInfo = getModeIndicator();

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

                    {/* Mode Indicator */}
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
                        <span>{modeInfo.emoji}</span>
                        <span className="text-sm text-gray-400">{modeInfo.label}</span>
                    </div>
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
                            Short Description * <span className="text-gray-500 font-normal">(always public)</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white resize-none"
                            placeholder="Brief description shown on project card (this is visible to everyone)"
                        />
                    </div>

                    {/* Full Pitch */}
                    <div>
                        <label htmlFor="pitch" className="block text-sm font-semibold text-gray-300 mb-2">
                            Full Pitch *
                            {formData.isPrivate && (
                                <span className="text-purple-400 font-normal ml-2">
                                    🔐 Will be encrypted
                                </span>
                            )}
                        </label>
                        <textarea
                            id="pitch"
                            name="pitch"
                            required
                            value={formData.pitch}
                            onChange={handleChange}
                            rows={6}
                            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white resize-none ${formData.isPrivate ? 'border-purple-500/50' : 'border-gray-700'
                                }`}
                            placeholder={formData.isPrivate
                                ? "Detailed project pitch (will be encrypted and only visible to approved investors)"
                                : "Detailed project pitch (will be visible to everyone)"
                            }
                        />
                        {formData.isPrivate && (
                            <p className="mt-2 text-sm text-purple-400/70">
                                ℹ️ This content will be encrypted. Only approved investors can view it.
                            </p>
                        )}
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
                    <div className={`p-6 rounded-xl border-2 transition-all ${formData.isPrivate
                            ? 'bg-purple-900/30 border-purple-500/50'
                            : 'bg-gray-800/50 border-gray-700/50'
                        }`}>
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
                                    Enable end-to-end encryption via {modeInfo.label}. Your pitch will be encrypted and only approved investors can view it.
                                </p>

                                {formData.isPrivate && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 space-y-3"
                                    >
                                        <ArciumBadge />

                                        <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                            <h4 className="font-medium text-white text-sm mb-2">How it works:</h4>
                                            <ul className="text-xs text-gray-400 space-y-1">
                                                <li>• Your pitch is encrypted using {isSimulationMode() ? 'AES-256-GCM' : 'Arcium MXE'}</li>
                                                <li>• Investors can only see the public description</li>
                                                <li>• Approved investors can decrypt and view your full pitch</li>
                                                <li>• You control who gets access</li>
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Encryption Status */}
                    <AnimatePresence>
                        {encryptionState.status !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-4 rounded-lg border ${encryptionState.status === 'error'
                                        ? 'bg-red-900/20 border-red-500/30 text-red-400'
                                        : encryptionState.status === 'encrypted'
                                            ? 'bg-green-900/20 border-green-500/30 text-green-400'
                                            : 'bg-purple-900/20 border-purple-500/30 text-purple-400'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {encryptionState.status === 'encrypting' && (
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    )}
                                    {encryptionState.status === 'encrypted' && (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {encryptionState.status === 'error' && (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                    <span>{encryptionState.message || encryptionState.error}</span>
                                </div>
                                {encryptionState.progress !== undefined && (
                                    <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                                        <div
                                            className="bg-purple-500 h-1 rounded-full transition-all"
                                            style={{ width: `${encryptionState.progress}%` }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                                {formData.isPrivate ? 'Encrypt & Create Project' : 'Create Project'}
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
