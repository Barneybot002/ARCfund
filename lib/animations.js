/**
 * Framer Motion animation variants
 * Reusable animations for consistent UX across the app
 */
// Fade in from opacity 0 to 1
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
// Slide up from bottom
export const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
// Slide down from top
export const slideDown = {
    hidden: { opacity: 0, y: -50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
// Slide in from left
export const slideLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
// Slide in from right
export const slideRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
// Scale up animation
export const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};
// Stagger container for children animations
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};
// Stagger item (use with staggerContainer)
export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};
// Card hover animation
export const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: {
        scale: 1.02,
        y: -8,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};
// Button hover animation
export const buttonHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
    tap: {
        scale: 0.95,
    },
};
// Number counter animation
export const counterAnimation = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
        opacity: 1,
        transition: {
            duration: 0.5,
            delay: custom * 0.1,
        },
    }),
};
// Gradient text animation
export const gradientText = {
    hidden: { backgroundPosition: '0% 50%' },
    visible: {
        backgroundPosition: '100% 50%',
        transition: {
            duration: 3,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
        },
    },
};
// Lock/Unlock animation for private projects
export const lockAnimation = {
    locked: {
        rotate: 0,
        scale: 1,
    },
    unlocked: {
        rotate: [0, -10, 10, -10, 0],
        scale: [1, 1.1, 1],
        transition: {
            duration: 0.6,
            ease: 'easeInOut',
        },
    },
};
// Page transition
export const pageTransition = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {
            duration: 0.4,
            ease: 'easeIn',
        },
    },
};
// Floating animation (for decorative elements)
export const float = {
    initial: { y: 0 },
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};
// Pulse animation (for badges/indicators)
export const pulse = {
    initial: { scale: 1, opacity: 1 },
    animate: {
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};
// Reduce motion variants (accessibility)
export const reduceMotion = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
};
