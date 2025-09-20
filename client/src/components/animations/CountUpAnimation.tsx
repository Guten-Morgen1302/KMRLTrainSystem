import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { MotionTokens, MotionColors } from '@/lib/motion';

interface CountUpAnimationProps {
  value: string; // e.g., "+23%", "-18%", "95%"
  duration?: number;
  className?: string;
  showPulse?: boolean;
  trend?: 'up' | 'down'; // For proper color coding
  testId?: string;
}

export default function CountUpAnimation({ 
  value, 
  duration = 2, 
  className = '',
  showPulse = true,
  trend = 'up',
  testId = 'count-up-animation'
}: CountUpAnimationProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Parse the value to extract number and formatting
  const parseValue = (val: string) => {
    const hasPlus = val.startsWith('+');
    const hasMinus = val.startsWith('-');
    const hasPercent = val.includes('%');
    const cleanNumber = parseFloat(val.replace(/[+\-%]/g, ''));
    
    return {
      number: hasPlus ? cleanNumber : hasMinus ? -cleanNumber : cleanNumber,
      hasPlus,
      hasMinus,
      hasPercent,
      isNegative: hasMinus,
    };
  };

  const { number, hasPlus, hasMinus, hasPercent, isNegative } = parseValue(value);

  // Use motion value for deterministic timing control
  const motionValue = useMotionValue(0);

  // Format number for display
  const formatDisplayValue = (currentNumber: number) => {
    const rounded = Math.round(currentNumber);
    const sign = hasPlus && rounded > 0 ? '+' : hasMinus && rounded < 0 ? '-' : '';
    const abs = Math.abs(rounded);
    const percent = hasPercent ? '%' : '';
    return `${sign}${abs}${percent}`;
  };

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      setIsAnimationComplete(true);
      return;
    }

    if (isInView) {
      // Start animation with a slight delay for dramatic effect
      const timer = setTimeout(() => {
        // Use deterministic timing with animate
        animate(motionValue, number, {
          duration: duration,
          ease: "easeOut",
          onUpdate: (latest) => {
            setDisplayValue(formatDisplayValue(latest));
          },
          onComplete: () => {
            setDisplayValue(value); // Ensure final value is exact
            setIsAnimationComplete(true);
          }
        });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isInView, number, motionValue, value, duration, hasPlus, hasMinus, hasPercent, prefersReducedMotion]);

  // Dynamic color based on trend and value direction - fixed logic for all cases
  const getValueColor = () => {
    // Positive value + up trend = favorable (good)
    if (!isNegative && trend === 'up') {
      return 'text-green-600 dark:text-green-400'; // Good improvements
    }
    // Negative value + down trend = favorable (good reductions)
    else if (isNegative && trend === 'down') {
      return 'text-green-600 dark:text-green-400'; // Good reductions
    }
    // Positive value + down trend = unfavorable (bad increase)
    else if (!isNegative && trend === 'down') {
      return 'text-red-600 dark:text-red-400'; // Bad increases
    }
    // Negative value + up trend = unfavorable (bad decline)
    else if (isNegative && trend === 'up') {
      return 'text-red-600 dark:text-red-400'; // Bad declines
    }
    // Fallback to professional color
    else {
      return 'text-primary';
    }
  };

  return (
    <motion.div 
      ref={ref}
      className={`relative ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{
        duration: MotionTokens.duration.smooth,
        ease: MotionTokens.easing.spring,
        delay: 0.1,
      }}
      data-testid={testId}
      aria-label={isAnimationComplete ? `${trend === 'up' ? 'Improved' : 'Reduced'} by ${value}` : 'Loading...'}
      {...(isAnimationComplete && { 'aria-live': 'polite' })}
    >
      {/* Pulsing background glow for impact */}
      {showPulse && isInView && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 -m-2 rounded-lg opacity-20"
          style={{
            background: `radial-gradient(circle, ${MotionColors.primary} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: 2, // Pulse a few times then stop
            ease: MotionTokens.easing.easeInOut,
          }}
          aria-hidden="true"
        />
      )}

      {/* Animated counter value */}
      <motion.span
        className={`relative z-10 font-bold ${getValueColor()}`}
        style={{
          fontVariantNumeric: 'tabular-nums', // Consistent number spacing
        }}
      >
        {prefersReducedMotion ? value : displayValue}
      </motion.span>

      {/* Success indicator for completed animation */}
      {isAnimationComplete && isInView && !prefersReducedMotion && (
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: MotionTokens.duration.fast,
            ease: MotionTokens.easing.bounce,
          }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}

// Utility component for percentage indicators
export function PercentageIndicator({ 
  value, 
  className = '' 
}: { 
  value: number; 
  className?: string; 
}) {
  return (
    <motion.div
      className={`flex items-center ${className}`}
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: MotionTokens.duration.normal,
        ease: MotionTokens.easing.easeOut,
      }}
    >
      <div 
        className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mr-2"
      >
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: '0%' }}
          whileInView={{ width: `${Math.abs(value)}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1.5,
            ease: MotionTokens.easing.easeOut,
            delay: 0.5,
          }}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {Math.abs(value)}%
      </span>
    </motion.div>
  );
}