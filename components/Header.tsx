/**
 * Header Component - Role-based navigation with profile dropdown
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import ArciumBadge from './ArciumBadge';
import ProfileSetupModal from './ProfileSetupModal';
import { slideDown } from '@/lib/animations';
import { getUserProfile, hasCompletedProfile, clearUserProfile, UserProfile, UserRole } from '@/lib/user-storage';

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { ready, authenticated, login, logout, user } = usePrivy();

    // Load user profile on mount and when auth changes
    useEffect(() => {
        if (authenticated && user?.wallet?.address) {
            const profile = getUserProfile();
            if (profile && profile.walletAddress === user.wallet.address) {
                setUserProfile(profile);
                setShowProfileModal(false);
            } else if (!hasCompletedProfile(user.wallet.address)) {
                // Show profile setup modal for first-time users
                setShowProfileModal(true);
            }
        } else {
            setUserProfile(null);
            setShowProfileModal(false);
        }
    }, [authenticated, user?.wallet?.address]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Navigation links based on authentication and role
    const getNavLinks = () => {
        // Not authenticated - simple nav
        if (!authenticated || !userProfile) {
            return [
                { href: '/', label: 'Home' },
                { href: '/dashboard', label: 'Dashboard' },
            ];
        }

        // Investor navigation
        if (userProfile.role === 'investor') {
            return [
                { href: '/', label: 'Home' },
                { href: '/browse', label: 'Browse Projects' },
                { href: '/your-investments', label: 'Your Investments' },
                { href: '/dashboard', label: 'Dashboard' },
            ];
        }

        // Founder navigation
        return [
            { href: '/', label: 'Home' },
            { href: '/create', label: 'Create Project', highlight: true },
            { href: '/your-projects', label: 'Your Projects' },
            { href: '/dashboard', label: 'Dashboard' },
        ];
    };

    const navLinks = getNavLinks();

    const handleConnectWallet = () => {
        if (!ready) return;
        login();
    };

    const handleProfileComplete = (name: string, role: UserRole) => {
        const profile = getUserProfile();
        setUserProfile(profile);
        setShowProfileModal(false);
    };

    const handleDisconnect = () => {
        clearUserProfile();
        setUserProfile(null);
        setDropdownOpen(false);
        logout();
    };

    const getDisplayName = () => {
        if (userProfile?.name) return userProfile.name;
        return 'User';
    };

    const getInitials = () => {
        if (userProfile?.name) {
            const names = userProfile.name.trim().split(' ');
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return names[0].slice(0, 2).toUpperCase();
        }
        return '?';
    };

    const isActivePath = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            <motion.header
                initial="hidden"
                animate="visible"
                variants={slideDown}
                className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-purple-500/20"
            >
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/20">
                                <span className="text-2xl font-bold text-white">A</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                                ARCfund
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActivePath(link.href)
                                            ? 'bg-purple-500/20 text-purple-300'
                                            : 'highlight' in link && link.highlight
                                                ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right side: Arcium Badge + User/Wallet */}
                        <div className="flex items-center gap-3">
                            {/* Arcium Badge */}
                            <div className="hidden lg:block">
                                <ArciumBadge showSubtext={false} />
                            </div>

                            {/* User Profile or Connect Button */}
                            {ready && (
                                authenticated && userProfile ? (
                                    <div className="relative" ref={dropdownRef}>
                                        {/* Profile Button */}
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/60 border border-gray-700/50 hover:border-purple-500/50 hover:bg-gray-800 transition-all duration-300"
                                        >
                                            {/* Avatar */}
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-inner ${userProfile.role === 'founder'
                                                    ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                                                    : 'bg-gradient-to-br from-violet-500 to-indigo-700'
                                                }`}>
                                                {getInitials()}
                                            </div>

                                            {/* Name */}
                                            <span className="hidden sm:block text-sm font-medium text-white max-w-[100px] truncate">
                                                {getDisplayName()}
                                            </span>

                                            {/* Dropdown Arrow */}
                                            <svg
                                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden"
                                                >
                                                    {/* User info header */}
                                                    <div className="px-4 py-3 border-b border-gray-800 bg-gray-800/50">
                                                        <p className="text-sm font-semibold text-white">{userProfile.name}</p>
                                                        <p className="text-xs text-gray-400 truncate mt-0.5">
                                                            {user?.wallet?.address?.slice(0, 10)}...{user?.wallet?.address?.slice(-6)}
                                                        </p>
                                                        <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-xs rounded-full font-medium ${userProfile.role === 'founder'
                                                                ? 'bg-purple-500/20 text-purple-300'
                                                                : 'bg-violet-500/20 text-violet-300'
                                                            }`}>
                                                            {userProfile.role === 'founder' ? '🚀 Founder' : '💰 Investor'}
                                                        </span>
                                                    </div>

                                                    {/* Menu items */}
                                                    <div className="py-1">
                                                        <Link
                                                            href="/dashboard"
                                                            onClick={() => setDropdownOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                            </svg>
                                                            Dashboard
                                                        </Link>

                                                        <Link
                                                            href="/settings"
                                                            onClick={() => setDropdownOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            Settings
                                                        </Link>
                                                    </div>

                                                    {/* Disconnect */}
                                                    <div className="border-t border-gray-800 py-1">
                                                        <button
                                                            onClick={handleDisconnect}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                            </svg>
                                                            Disconnect
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleConnectWallet}
                                        disabled={!ready}
                                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {!ready ? 'Loading...' : 'Connect Wallet'}
                                    </button>
                                )
                            )}

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
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
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden py-4 border-t border-gray-800"
                            >
                                <div className="space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${isActivePath(link.href)
                                                    ? 'bg-purple-500/20 text-purple-300'
                                                    : 'highlight' in link && link.highlight
                                                        ? 'text-purple-400'
                                                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {authenticated && userProfile && (
                                    <div className="mt-4 pt-4 border-t border-gray-800 space-y-1">
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleDisconnect}
                                            className="w-full text-left px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-gray-800/50 rounded-lg"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-800">
                                    <ArciumBadge />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </motion.header>

            {/* Profile Setup Modal */}
            {user?.wallet?.address && (
                <ProfileSetupModal
                    isOpen={showProfileModal}
                    walletAddress={user.wallet.address}
                    onComplete={handleProfileComplete}
                />
            )}
        </>
    );
}
