// Motion Design System for Metro Yukti - Government Standard with Hackathon Polish
// Professional animations that respect accessibility and government design principles

export const MotionTokens = {
  // Timing - Professional but engaging
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    smooth: 0.5,
    slow: 0.8,
    dramatic: 1.2,
  },
  
  // Easing curves - Government-appropriate smoothness
  easing: {
    // Standard easings - framer-motion compatible format
    linear: 'linear',
    easeOut: [0.25, 0.46, 0.45, 0.94],
    easeIn: [0.55, 0.06, 0.68, 0.19],
    easeInOut: [0.42, 0, 0.58, 1],
    
    // Professional spring curves
    spring: [0.68, -0.6, 0.32, 1.6],
    bounce: [0.68, -0.55, 0.265, 1.55],
    
    // Metro-themed curves (smooth like train movement)
    metro: [0.25, 0.1, 0.25, 1],
    station: [0.4, 0, 0.2, 1],
  },
  
  // Scale values for professional animations
  scale: {
    subtle: 1.02,
    gentle: 1.05,
    noticeable: 1.1,
    prominent: 1.15,
  },
  
  // Opacity levels
  opacity: {
    hidden: 0,
    subtle: 0.3,
    visible: 0.7,
    full: 1,
  },
  
  // Spacing for staggered animations
  stagger: {
    tight: 0.05,
    normal: 0.1,
    loose: 0.2,
    dramatic: 0.3,
  },
  
  // Government-appropriate blur values
  blur: {
    none: 0,
    subtle: 2,
    medium: 4,
    strong: 8,
  },
};

// Framer Motion Variants for consistent animations
export const AnimationVariants = {
  // Page/Section animations
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: MotionTokens.duration.smooth,
        ease: MotionTokens.easing.metro,
      }
    },
  },
  
  // Staggered children animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: MotionTokens.stagger.normal,
        delayChildren: 0.1,
      }
    }
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: MotionTokens.duration.normal,
        ease: MotionTokens.easing.easeOut,
      }
    },
  },
  
  // Card hover effects - professional micro-interactions
  cardHover: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    hover: { 
      scale: MotionTokens.scale.subtle,
      y: -2,
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      transition: {
        duration: MotionTokens.duration.fast,
        ease: MotionTokens.easing.easeOut,
      }
    },
  },
  
  // Button interactions
  buttonPress: {
    whileTap: { 
      scale: 0.98,
      transition: { duration: MotionTokens.duration.instant }
    },
  },
  
  // Count-up number animations
  countUp: {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: MotionTokens.duration.smooth,
        ease: MotionTokens.easing.spring,
      }
    },
  },
  
  // Metro/train themed animations
  trainMove: {
    animate: {
      x: [0, 100, 200, 300, 400],
      transition: {
        duration: 8,
        ease: MotionTokens.easing.metro,
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    }
  },
  
  stationPulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        ease: MotionTokens.easing.easeInOut,
        repeat: Infinity,
        repeatDelay: 1,
      }
    }
  },
  
  // Decision flow animations
  flowToken: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: MotionTokens.duration.normal,
        ease: MotionTokens.easing.bounce,
      }
    },
  },
  
  // Loading states
  loadingBar: {
    initial: { width: '0%' },
    animate: {
      width: '100%',
      transition: {
        duration: 2,
        ease: MotionTokens.easing.metro,
      }
    }
  },
  
  skeleton: {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        ease: MotionTokens.easing.easeInOut,
        repeat: Infinity,
      }
    }
  },
};

// Accessibility-aware motion utilities
export const getReducedMotionVariant = (variant: any) => {
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
  if (prefersReducedMotion) {
    // Return static versions for reduced motion
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    };
  }
  
  return variant;
};

// Professional color palette for animations (teal government theme)
export const MotionColors = {
  primary: 'hsl(180, 100%, 30%)',
  primaryLight: 'hsl(180, 80%, 40%)',
  secondary: 'hsl(220, 13%, 69%)',
  success: 'hsl(158, 64%, 52%)',
  warning: 'hsl(43, 96%, 56%)',
  danger: 'hsl(0, 84%, 60%)',
  
  // Animation-specific colors
  glow: 'rgba(20, 184, 166, 0.4)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  highlight: 'rgba(255, 255, 255, 0.1)',
};

// Utility functions for dynamic animations
export const createStaggeredAnimation = (itemCount: number, staggerDelay = MotionTokens.stagger.normal) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    }
  }
});

export const createScrollTriggeredAnimation = (threshold = 0.1) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: MotionTokens.duration.smooth,
      ease: MotionTokens.easing.easeOut,
    }
  },
  viewport: { once: true, amount: threshold },
});