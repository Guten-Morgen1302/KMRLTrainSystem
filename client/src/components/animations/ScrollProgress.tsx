import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MotionColors, MotionTokens } from '@/lib/motion';

interface ScrollProgressProps {
  className?: string;
  showLabel?: boolean;
}

export default function ScrollProgress({ 
  className = '', 
  showLabel = false 
}: ScrollProgressProps) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Smooth spring animation for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Only track scroll percentage when label is shown (performance optimization)
  useEffect(() => {
    if (!showLabel) return;
    
    return scrollYProgress.onChange((latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress, showLabel]);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null; // Don't show progress bar if user prefers reduced motion
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={showLabel ? scrollPercent : undefined}
    >
      {/* Progress bar background */}
      <div className="h-1 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
        {/* Animated progress bar */}
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent origin-left"
          style={{ 
            scaleX,
            background: `linear-gradient(90deg, ${MotionColors.primary} 0%, ${MotionColors.primaryLight} 100%)`,
          }}
        />
      </div>
      
      {/* Optional progress percentage label */}
      {showLabel && (
        <motion.div
          className="absolute top-2 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-md px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: MotionTokens.duration.normal,
            ease: MotionTokens.easing.easeOut,
          }}
        >
          {scrollPercent}%
        </motion.div>
      )}
    </div>
  );
}

// Hook for scroll-triggered reveal animations
export function useScrollReveal() {
  return {
    initial: { opacity: 0, y: 50 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: MotionTokens.duration.smooth,
        ease: MotionTokens.easing.easeOut,
      }
    },
    viewport: { once: true, amount: 0.2 },
  };
}

// Staggered container for multiple elements
export function useStaggeredReveal(staggerDelay = MotionTokens.stagger.normal) {
  return {
    container: {
      initial: {},
      whileInView: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        }
      },
      viewport: { once: true, amount: 0.1 },
    },
    item: {
      initial: { opacity: 0, y: 30 },
      whileInView: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: MotionTokens.duration.normal,
          ease: MotionTokens.easing.easeOut,
        }
      },
    },
  };
}