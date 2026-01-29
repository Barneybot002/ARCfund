/**
 * Header Component - Navigation with Arcium badge and Privy wallet button
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import ArciumBadge from './ArciumBadge';
import { slideDown } from '@/lib/animations';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { ready, authenticated, login, logout, user } = usePrivy();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/browse', label: 'Browse Projects' },
        { href: '/create', label: 'Create Project' },
        { href: '/dashboard', label: 'Dashboard' },
    ];

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={slideDown}
            className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-purple-500/20"
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl font-bold text-white">A</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                            ARCfund
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side: Arcium Badge + Wallet Button */}
                    <div className="flex items-center gap-4">
                        {/* Arcium Badge */}
                        <div className="hidden lg:block">
                            <ArciumBadge showSubtext={false} />
                        </div>

                        {/* Wallet Button */}
                        {ready && (
                            <button
                                onClick={authenticated ? logout : login}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-lg font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap"
                            >
                                {authenticated
                                    ? `${user?.wallet?.address?.slice(0, 6)}...${user?.wallet?.address?.slice(-4)}`
                                    : 'Connect Wallet'}
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-400 hover:text-white"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 space-y-4"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4">
                            <ArciumBadge />
                        </div>
                    </motion.div>
                )}
            </nav>
        </motion.header>
    );
}
