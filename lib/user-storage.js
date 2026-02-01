/**
 * User Storage - localStorage helpers for user profile data
 */
const STORAGE_KEY = 'arcfund_user_profile';
const PROFILE_CHANGE_EVENT = 'arcfund_profile_change';
/**
 * Get user profile from localStorage
 */
export function getUserProfile() {
    if (typeof window === 'undefined')
        return null;
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data)
            return null;
        return JSON.parse(data);
    }
    catch {
        return null;
    }
}
/**
 * Save user profile to localStorage
 */
export function saveUserProfile(profile) {
    const now = new Date().toISOString();
    const existingProfile = getUserProfile();
    const fullProfile = {
        ...profile,
        setupComplete: true,
        createdAt: existingProfile?.createdAt || now,
        updatedAt: now,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProfile));
    // Dispatch custom event so other components can react to profile changes
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: fullProfile }));
    }
    return fullProfile;
}
/**
 * Update user profile partially
 */
export function updateUserProfile(updates) {
    const existingProfile = getUserProfile();
    if (!existingProfile)
        return null;
    const updatedProfile = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    // Dispatch custom event so other components can react to profile changes
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: updatedProfile }));
    }
    return updatedProfile;
}
/**
 * Update user role specifically with page reload for full UI refresh
 */
export function updateUserRole(newRole) {
    const updated = updateUserProfile({ role: newRole });
    return updated;
}
/**
 * Clear user profile from localStorage
 */
export function clearUserProfile() {
    if (typeof window === 'undefined')
        return;
    localStorage.removeItem(STORAGE_KEY);
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: null }));
}
/**
 * Check if user has completed profile setup
 */
export function hasCompletedProfile(walletAddress) {
    const profile = getUserProfile();
    if (!profile)
        return false;
    // If wallet address is provided, check if it matches
    if (walletAddress && profile.walletAddress !== walletAddress) {
        return false;
    }
    return profile.setupComplete && Boolean(profile.name && profile.role);
}
/**
 * Check if current user is a founder
 */
export function isFounder() {
    const profile = getUserProfile();
    return profile?.role === 'founder';
}
/**
 * Check if current user is an investor
 */
export function isInvestor() {
    const profile = getUserProfile();
    return profile?.role === 'investor';
}
/**
 * Subscribe to profile changes
 */
export function onProfileChange(callback) {
    if (typeof window === 'undefined')
        return () => { };
    const handler = (event) => {
        const customEvent = event;
        callback(customEvent.detail);
    };
    window.addEventListener(PROFILE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(PROFILE_CHANGE_EVENT, handler);
}
/**
 * Event name for profile changes (for external use)
 */
export const PROFILE_CHANGE_EVENT_NAME = PROFILE_CHANGE_EVENT;
