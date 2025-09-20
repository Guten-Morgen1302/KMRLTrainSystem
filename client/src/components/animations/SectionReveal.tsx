import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useScrollReveal, useStaggeredReveal } from './ScrollProgress';
import { getReducedMotionVariant } from '@/lib/motion';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: boolean;
  delay?: number;
}

export default function SectionReveal({ 
  children, 
  className = '', 
  staggerChildren = false,
  delay = 0
}: SectionRevealProps) {
  const scrollReveal = useScrollReveal();
  const staggeredReveal = useStaggeredReveal();

  // Create variant with proper delay implementation
  const createDelayedVariant = (baseVariant: any) => {
    if (delay === 0) return baseVariant;
    
    return {
      ...baseVariant,
      whileInView: {
        ...baseVariant.whileInView,
        transition: {
          ...baseVariant.whileInView.transition,
          delay,
        }
      }
    };
  };

  if (staggerChildren) {
    // Create delayed stagger container variant
    const delayedStaggerContainer = {
      ...staggeredReveal.container,
      whileInView: {
        transition: {
          staggerChildren: staggeredReveal.container.whileInView.transition.staggerChildren,
          delayChildren: staggeredReveal.container.whileInView.transition.delayChildren + delay,
        }
      },
      viewport: staggeredReveal.container.viewport,
    };

    return (
      <motion.div
        className={className}
        variants={getReducedMotionVariant(delayedStaggerContainer)}
        initial="initial"
        whileInView="whileInView"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={getReducedMotionVariant(createDelayedVariant(scrollReveal))}
      initial="initial"
      whileInView="whileInView"
    >
      {children}
    </motion.div>
  );
}

// Individual staggered item component
export function RevealItem({ 
  children, 
  className = '' 
}: { children: ReactNode; className?: string }) {
  const { item } = useStaggeredReveal();
  
  return (
    <motion.div
      className={className}
      variants={getReducedMotionVariant(item)}
    >
      {children}
    </motion.div>
  );
}