/**
 * Browse Projects Page
 * Grid of all projects with filters and animations
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import { dummyProjects } from '@/lib/dummy-data';
import { ProjectCategory } from '@/lib/types';
import { staggerContainer, staggerItem, slideUp } from '@/lib/animations';

export default function BrowsePage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showPrivateOnly, setShowPrivateOnly] = useState(false);

    const categories = ['all', ...Object.values(ProjectCategory)];

    const filteredProjects = dummyProjects.filter((project) => {
        const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
        const privacyMatch = !showPrivateOnly || project.isPrivate;
        return categoryMatch && privacyMatch;
    });

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={slideUp}
                className="max-w-7xl mx-auto text-center mb-16"
            >
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                        Browse Projects
                    </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    Discover innovative projects seeking funding. Some projects are encrypted with Arcium MXE for privacy.
                </p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-7xl mx-auto mb-12"
            >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {category === 'all' ? 'All Projects' : category}
                            </button>
                        ))}
                    </div>

                    {/* Privacy Filter */}
                    <button
                        onClick={() => setShowPrivateOnly(!showPrivateOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${showPrivateOnly
                                ? 'bg-purple-600/20 text-purple-300 border-2 border-purple-500'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        Private Only
                    </button>
                </div>

                {/* Results Count */}
                <div className="text-center mt-6 text-gray-400">
                    Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                </div>
            </motion.div>

            {/* Projects Grid */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-7xl mx-auto"
            >
                {filteredProjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                variants={staggerItem}
                                custom={index}
                            >
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <svg
                            className="w-24 h-24 text-gray-600 mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-xl text-gray-400">No projects found matching your filters</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setShowPrivateOnly(false);
                            }}
                            className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                        >
                            Reset Filters
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
