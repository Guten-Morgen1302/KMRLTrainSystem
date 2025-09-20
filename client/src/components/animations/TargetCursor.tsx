import { useEffect, useRef } from 'react';

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
}

export default function TargetCursor({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isOverTargetRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Hide default cursor
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const handleMouseEnter = () => {
      isOverTargetRef.current = true;
      cursor.classList.add('cursor-targeting');
    };

    const handleMouseLeave = () => {
      isOverTargetRef.current = false;
      cursor.classList.remove('cursor-targeting');
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    
    const targets = document.querySelectorAll(targetSelector);
    targets.forEach(target => {
      target.addEventListener('mouseenter', handleMouseEnter);
      target.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      targets.forEach(target => {
        target.removeEventListener('mouseenter', handleMouseEnter);
        target.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (hideDefaultCursor) {
        document.body.style.cursor = 'auto';
      }
    };
  }, [targetSelector, hideDefaultCursor]);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 transition-all duration-200 ease-out"
      style={{
        left: '-50px',
        top: '-50px',
        width: '24px',
        height: '24px',
      }}
    >
      {/* Outer ring */}
      <div 
        className="absolute inset-0 cursor-border border-2 border-primary rounded-full transition-all duration-300 ease-out"
        style={{
          width: '24px',
          height: '24px',
          animation: `cursor-spin ${spinDuration}s linear infinite`,
        }}
      />
      
      {/* Inner crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="cursor-center w-2 h-2 bg-primary rounded-full transition-all duration-300 ease-out" />
      </div>
      
      {/* Target lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-8 h-0.5 bg-accent/60" style={{ left: '-8px' }} />
        <div className="absolute w-0.5 h-8 bg-accent/60" style={{ top: '-8px' }} />
      </div>

    </div>
  );
}