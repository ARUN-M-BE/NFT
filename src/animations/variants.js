// Framer Motion animation variants

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

export const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

export const slideDown = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

export const slideLeft = {
    hidden: { x: 20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

export const slideRight = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

export const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

export const hoverScale = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3, ease: 'easeInOut' }
    }
};

export const cardHover = {
    rest: {
        scale: 1,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    hover: {
        scale: 1.02,
        boxShadow: '0 10px 20px rgba(24, 144, 255, 0.3)',
        transition: { duration: 0.3, ease: 'easeInOut' }
    }
};

export const pulseGlow = {
    animate: {
        boxShadow: [
            '0 0 20px rgba(24, 144, 255, 0.5)',
            '0 0 40px rgba(24, 144, 255, 0.8)',
            '0 0 20px rgba(24, 144, 255, 0.5)',
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};
