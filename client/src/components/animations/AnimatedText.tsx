import { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'typewriter' | 'glitch' | 'wave';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedText({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 1000,
  className = '',
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const textContent = typeof children === 'string' ? children : '';
    
    if (animation === 'typewriter') {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayText(textContent.slice(0, i + 1));
        i++;
        if (i >= textContent.length) {
          clearInterval(timer);
        }
      }, duration / textContent.length);
      
      return () => clearInterval(timer);
    } else {
      setDisplayText(textContent);
    }
  }, [isVisible, children, animation, duration]);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    
    switch (animation) {
      case 'fadeInUp':
        return 'animate-fade-in-up opacity-100';
      case 'typewriter':
        return 'opacity-100';
      case 'glitch':
        return 'animate-glitch opacity-100';
      case 'wave':
        return 'animate-wave opacity-100';
      default:
        return 'opacity-100';
    }
  };

  const textContent = typeof children === 'string' ? children : '';
  
  return (
    <div ref={ref} className={`${className} ${getAnimationClass()} transition-all duration-1000`}>
      {animation === 'wave' ? (
        <span>
          {textContent.split('').map((char, index) => (
            <span
              key={index}
              className="inline-block animate-bounce"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '2s',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      ) : animation === 'typewriter' ? (
        <span>
          {displayText}
          {isVisible && displayText.length < textContent.length && (
            <span className="animate-pulse">|</span>
          )}
        </span>
      ) : (
        children
      )}
    </div>
  );
}