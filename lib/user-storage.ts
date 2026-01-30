/**
 * User Storage - localStorage helpers for user profile data
 */

export type UserRole = 'founder' | 'investor';

export interface UserProfile {
    name: string;
    role: UserRole;
    walletAddress: string;
    setupComplete: boolean;
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = 'arcfund_user_profile';

/**
 * Get user profile from localStorage
 */
export function getUserProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        return JSON.parse(data) as UserProfile;
    } catch {
        return null;
    }
}

/**
 * Save user profile to localStorage
 */
export function saveUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt' | 'setupComplete'>): UserProfile {
    const now = new Date().toISOString();
    const existingProfile = getUserProfile();

    const fullProfile: UserProfile = {
        ...profile,
        setupComplete: true,
        createdAt: existingProfile?.createdAt || now,
        updatedAt: now,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProfile));
    return fullProfile;
}

/**
 * Update user profile partially
 */
export function updateUserProfile(updates: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>): UserProfile | null {
    const existingProfile = getUserProfile();
    if (!existingProfile) return null;

    const updatedProfile: UserProfile = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    return updatedProfile;
}

/**
 * Clear user profile from localStorage
 */
export function clearUserProfile(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if user has completed profile setup
 */
export function hasCompletedProfile(walletAddress?: string): boolean {
    const profile = getUserProfile();
    if (!profile) return false;

    // If wallet address is provided, check if it matches
    if (walletAddress && profile.walletAddress !== walletAddress) {
        return false;
    }

    return profile.setupComplete && Boolean(profile.name && profile.role);
}

/**
 * Check if current user is a founder
 */
export function isFounder(): boolean {
    const profile = getUserProfile();
    return profile?.role === 'founder';
}

/**
 * Check if current user is an investor
 */
export function isInvestor(): boolean {
    const profile = getUserProfile();
    return profile?.role === 'investor';
}
