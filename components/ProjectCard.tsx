/**
 * ProjectCard Component - Card for displaying projects in grid
 * Includes encryption badges, hover effects, and funding progress
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Project } from '@/lib/types';
import { formatCurrency, getFundingProgress } from '@/lib/dummy-data';
import EncryptionBadge from './EncryptionBadge';
import { cardHover } from '@/lib/animations';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const progress = getFundingProgress(project);

    return (
        <Link href={`/project/${project.id}`}>
            <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="group bg-gray-800/50 rounded-xl border border-purple-500/20 hover:border-purple-500/40 overflow-hidden backdrop-blur-sm transition-all duration-300 cursor-pointer h-full flex flex-col"
            >
                {/* Image/Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-purple-900/40 to-violet-900/40 overflow-hidden">
                    {project.imageUrl ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg
                                className="w-16 h-16 text-purple-500/30"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Encryption Badge Overlay */}
                    {project.isEncrypted && (
                        <div className="absolute top-3 right-3">
                            <EncryptionBadge isEncrypted={true} variant="compact" showTooltip={false} />
                        </div>
                    )}

                    {/* Category Badge */}
                    {project.category && (
                        <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-xs font-medium text-purple-300 border border-purple-500/30">
                                {project.category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
                        {project.description}
                    </p>

                    {/* Founder */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <span>{project.founderName || 'Anonymous'}</span>
                    </div>

                    {/* Funding Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">
                                {formatCurrency(project.currentFunding)} raised
                            </span>
                            <span className="text-purple-400 font-semibold">
                                {progress.toFixed(0)}%
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="h-full bg-gradient-to-r from-purple-600 to-violet-600 rounded-full"
                            />
                        </div>

                        <div className="text-sm text-gray-500">
                            Goal: {formatCurrency(project.fundingGoal)}
                        </div>
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {project.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-purple-600/10 text-purple-300 text-xs rounded-md border border-purple-500/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer - Lock Icon for Private */}
                {project.isPrivate && (
                    <div className="px-6 py-3 bg-purple-900/20 border-t border-purple-500/20">
                        <div className="flex items-center gap-2 text-sm text-purple-300">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <span>Request access to view full details</span>
                        </div>
                    </div>
                )}
            </motion.div>
        </Link>
    );
}
