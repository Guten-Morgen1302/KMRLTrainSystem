import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MotionTokens } from '@/lib/motion';
import { Train } from 'lucide-react';

interface LoadingAnimationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'train' | 'platform' | 'signal' | 'metro-line' | 'dots';
  text?: string;
}


function TrainSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeMap = {
    sm: { width: 40, height: 20, icon: 14 },
    md: { width: 60, height: 30, icon: 18 },
    lg: { width: 80, height: 40, icon: 24 }
  };
  
  const dimensions = sizeMap[size];

  if (prefersReducedMotion) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div 
          className="bg-primary rounded-lg flex items-center justify-center"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <Train size={dimensions.icon} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Railway Track */}
      <div className="absolute inset-0 flex items-center">
        <motion.div
          className="h-0.5 bg-slate-300 dark:bg-slate-600 rounded"
          style={{ width: dimensions.width + 40 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: MotionTokens.easing.easeInOut,
          }}
        />
        {/* Track sleepers */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-3 bg-slate-400 dark:bg-slate-500"
            style={{ left: (i + 1) * (dimensions.width / 4) }}
            animate={{
              scaleY: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: MotionTokens.easing.easeInOut,
            }}
          />
        ))}
      </div>
      
      {/* Moving Train */}
      <motion.div
        className="bg-primary rounded-lg flex items-center justify-center shadow-lg relative z-10"
        style={{ width: dimensions.width, height: dimensions.height }}
        animate={{
          x: [-dimensions.width, dimensions.width],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          x: {
            duration: 3,
            repeat: Infinity,
            ease: MotionTokens.easing.metro,
          },
          rotate: {
            duration: 0.5,
            repeat: Infinity,
            ease: MotionTokens.easing.easeInOut,
          }
        }}
      >
        <Train size={dimensions.icon} className="text-white" />
        
        {/* Train lights */}
        <motion.div
          className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-yellow-400 rounded-full"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: MotionTokens.easing.easeInOut,
          }}
        />
      </motion.div>
    </div>
  );
}

function PlatformDots({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  
  const dotCount = 5;
  const sizeMap = { sm: 6, md: 8, lg: 10 };
  const dotSize = sizeMap[size];

  if (prefersReducedMotion) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {Array.from({ length: dotCount }).map((_, i) => (
          <div
            key={i}
            className="bg-accent rounded-full opacity-60"
            style={{ width: dotSize, height: dotSize }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {Array.from({ length: dotCount }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-accent rounded-full"
          style={{ width: dotSize, height: dotSize }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: MotionTokens.easing.bounce,
          }}
        />
      ))}
    </div>
  );
}

function SignalSequence({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeMap = { sm: 12, md: 16, lg: 20 };
  const signalSize = sizeMap[size];
  
  // Static color map to avoid dynamic Tailwind classes
  const signalColors = {
    red: { bg: 'bg-red-500', style: { backgroundColor: '#ef4444' } },
    yellow: { bg: 'bg-yellow-500', style: { backgroundColor: '#f59e0b' } },
    green: { bg: 'bg-green-500', style: { backgroundColor: '#22c55e' } },
  };
  
  const signals = [
    { color: 'red', index: 0 },
    { color: 'yellow', index: 1 },
    { color: 'green', index: 2 },
  ] as const;
  
  if (prefersReducedMotion) {
    return (
      <div className={`flex flex-col items-center space-y-1 ${className}`}>
        <div 
          className="bg-green-500 rounded-full opacity-80"
          style={{ width: signalSize, height: signalSize, ...signalColors.green.style }}
        />
        <div 
          className="bg-yellow-500 rounded-full opacity-30"
          style={{ width: signalSize, height: signalSize, ...signalColors.yellow.style }}
        />
        <div 
          className="bg-red-500 rounded-full opacity-30"
          style={{ width: signalSize, height: signalSize, ...signalColors.red.style }}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-1 ${className}`}>
      {signals.map(({ color, index }) => (
        <motion.div
          key={color}
          className={`rounded-full ${signalColors[color].bg}`}
          style={{ width: signalSize, height: signalSize, ...signalColors[color].style }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.7,
            ease: MotionTokens.easing.easeInOut,
          }}
        />
      ))}
    </div>
  );
}

function MetroLineLoader({ className = '', text, size = 'md' }: { className?: string, text?: string, size?: 'sm' | 'md' | 'lg' }) {
  const prefersReducedMotion = useReducedMotion();

  const sizeMap = {
    sm: { height: 4, station: 8, text: 'text-xs' },
    md: { height: 6, station: 10, text: 'text-sm' },
    lg: { height: 8, station: 12, text: 'text-base' },
  };
  
  const dimensions = sizeMap[size];

  if (prefersReducedMotion) {
    return (
      <div className={`w-full ${className}`}>
        {text && (
          <div className={`${dimensions.text} text-muted-foreground mb-2 text-center`}>
            {text}
          </div>
        )}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full" style={{ height: dimensions.height }}>
          <div className="h-full bg-primary rounded-full w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {text && (
        <motion.div 
          className={`${dimensions.text} text-muted-foreground mb-2 text-center`}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: MotionTokens.easing.easeInOut,
          }}
        >
          {text}
        </motion.div>
      )}
      
      <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden" style={{ height: dimensions.height }}>
        {/* Metro stations along the line */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 bg-slate-400 dark:bg-slate-500 rounded-full border border-white"
            style={{ 
              left: `${(i + 1) * 20}%`, 
              width: dimensions.station, 
              height: dimensions.station,
              transform: 'translateY(-50%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              borderColor: ['#ffffff', '#3b82f6', '#ffffff'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: MotionTokens.easing.metro,
            }}
          />
        ))}
        
        {/* Moving progress train - transform-based animation */}
        <motion.div
          className="absolute top-0 h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
          style={{ 
            width: '25%',
            willChange: 'transform',
            transformOrigin: 'left',
          }}
          animate={{
            x: ['-100%', '400%'],
            scaleX: [1, 1.2, 1],
          }}
          transition={{
            x: {
              duration: 3,
              repeat: Infinity,
              ease: MotionTokens.easing.metro,
            },
            scaleX: {
              duration: 1.5,
              repeat: Infinity,
              ease: MotionTokens.easing.easeInOut,
            }
          }}
        />
      </div>
    </div>
  );
}

// Main component that combines different loading animations
export default function MetroLoadingAnimations({ 
  className = '', 
  size = 'md', 
  variant = 'train', 
  text 
}: LoadingAnimationProps) {
  const prefersReducedMotion = useReducedMotion();

  const renderAnimation = () => {
    switch (variant) {
      case 'train':
        return <TrainSpinner size={size} />;
      case 'platform':
        return <PlatformDots size={size} />;
      case 'signal':
        return <SignalSequence size={size} />;
      case 'metro-line':
        return <MetroLineLoader text={text} size={size} />;
      case 'dots':
        return <PlatformDots size={size} />;
      default:
        return <TrainSpinner size={size} />;
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center p-4 ${className}`}
      data-testid={`metro-loading-${variant}`}
      role="status"
      aria-live="polite"
      aria-label={text || "Loading..."}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
          transition={{
            duration: MotionTokens.duration.normal,
            ease: MotionTokens.easing.easeOut,
          }}
        >
          {renderAnimation()}
        </motion.div>
      </AnimatePresence>
      
      {text && variant !== 'metro-line' && (
        <motion.p 
          className="mt-3 text-sm text-muted-foreground text-center"
          animate={prefersReducedMotion ? {} : {
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: MotionTokens.easing.easeInOut,
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Export individual components for direct use
export { TrainSpinner, PlatformDots, SignalSequence, MetroLineLoader };