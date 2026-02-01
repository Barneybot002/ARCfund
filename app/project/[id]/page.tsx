/**
 * Project Detail Page [id]
 * Shows project details with encryption guard for private projects
 */

'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { formatCurrency, formatDate, truncateAddress } from '@/lib/dummy-data';
import { getUserProfile } from '@/lib/user-storage';
import * as projectStorage from '@/lib/project-storage';
import { PublicKey } from '@solana/web3.js';
import EncryptionBadge from '@/components/EncryptionBadge';
import PrivateGuard from '@/components/PrivateGuard';
import { slideRight, slideUp } from '@/lib/animations';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [onchainProject, setOnchainProject] = useState<any | null>(null);
    const [decrypted, setDecrypted] = useState<any | null>(null);
    const [accessRequest, setAccessRequest] = useState<any | null>(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setIsLoading(true);
            try {
                const profile = getUserProfile();
                const investorPk = profile?.walletAddress ? new PublicKey(profile.walletAddress) : undefined;
                const res = await projectStorage.getProjectWithAccess(params.id, investorPk as any);

                if (!mounted) return;
                setOnchainProject(res.onchain ?? null);
                setAccessRequest(res.accessRequest ?? null);
                setDecrypted(res.decrypted ?? null);
                setHasAccess(Boolean(!onchainProject?.isEncrypted || res.decrypted));
            } catch (err) {
                console.warn('Failed to load project:', err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        }

        load();
        return () => { mounted = false; };
    }, [params.id]);
    const { authenticated } = usePrivy();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!onchainProject) {
        notFound();
    }

    const progress = 0; // placeholder, onchain stats not yet normalized
    const isOwner = false;

    const userHasAccess = !onchainProject.isEncrypted || Boolean(decrypted) || isOwner;

    const handleRequestAccess = async () => {
        const profile = getUserProfile();
        if (!profile?.walletAddress) return;
        try {
            const pk = new PublicKey(profile.walletAddress);
            await projectStorage.requestAccess(params.id, pk);
            setAccessRequest({ status: 'Pending' });
        } catch (err) {
            console.error('Request access failed:', err);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Project Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={slideRight}
                    className="mb-12"
                >
                    {/* Category & Encryption Badge */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {project.category && (
                            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg font-medium border border-purple-500/30">
                                {project.category}
                            </span>
                        )}
                        {project.isEncrypted && <EncryptionBadge isEncrypted={true} />}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        {project.title}
                    </h1>

                    {/* Founder Info */}
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span>{project.founderName || 'Anonymous'}</span>
                        </div>
                        <span>•</span>
                        <span>{truncateAddress(project.founder)}</span>
                        <span>•</span>
                        <span>{formatDate(project.createdAt)}</span>
                    </div>
                </motion.div>

                {userHasAccess ? (
                    <>
                        {/* Project Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={slideUp}
                            className="grid lg:grid-cols-3 gap-8"
                        >
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Description */}
                                <div className="bg-gray-800/50 rounded-xl p-8 border border-purple-500/20">
                                    <h2 className="text-2xl font-bold mb-4 text-white">About This Project</h2>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                        {decrypted ? decrypted.pitch : (onchainProject?.description || 'No description available')}
                                    </p>
                                </div>

                                {/* Team */}
                                {project.team && project.team.length > 0 && (
                                    <div className="bg-gray-800/50 rounded-xl p-8 border border-purple-500/20">
                                        <h2 className="text-2xl font-bold mb-6 text-white">Team</h2>
                                        <div className="space-y-4">
                                            {project.team.map((member, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {member.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white">{member.name}</div>
                                                        <div className="text-sm text-gray-400">{member.role}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Timeline */}
                                {project.timeline && (
                                    <div className="bg-gray-800/50 rounded-xl p-8 border border-purple-500/20">
                                        <h2 className="text-2xl font-bold mb-4 text-white">Timeline</h2>
                                        <p className="text-gray-300">{project.timeline}</p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Funding Card */}
                                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm sticky top-24">
                                    <h3 className="text-2xl font-bold mb-6 text-white">Funding</h3>

                                    {/* Progress */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <span className="text-3xl font-bold text-white">
                                                {formatCurrency(project.currentFunding)}
                                            </span>
                                            <span className="text-purple-400 font-semibold">{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1 }}
                                                className="h-full bg-gradient-to-r from-purple-600 to-violet-600"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            of {formatCurrency(project.fundingGoal)} goal
                                        </p>
                                    </div>

                                    {/* Invest Button */}
                                    {authenticated ? (
                                        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-lg font-semibold transition-all hover:scale-105">
                                            Invest Now
                                        </button>
                                    ) : (
                                        <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors">
                                            Connect Wallet to Invest
                                        </button>
                                    )}

                                    {/* Tags */}
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-700">
                                            <h4 className="text-sm font-semibold text-gray-400 mb-3">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 bg-purple-600/10 text-purple-300 text-sm rounded-md border border-purple-500/20"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                ) : (
                    <PrivateGuard
                        projectId={project.id}
                        projectTitle={project.title}
                        hasAccess={hasAccess}
                        onRequestAccess={handleRequestAccess}
                    />
                )}
            </div>
        </div>
    );
}
