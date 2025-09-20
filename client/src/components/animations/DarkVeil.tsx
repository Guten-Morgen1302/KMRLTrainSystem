import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
}

export default function DarkVeil({
  hueShift = 180, // Match website's exact teal theme (180 hue)
  noiseIntensity = 0.6,
  scanlineIntensity = 0.3,
  speed = 0.5,
  scanlineFrequency = 0.8,
  warpAmount = 0.1,
  resolutionScale = 1,
}: DarkVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Render static background only
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      ctx.fillStyle = isDark ? 'hsl(180, 100%, 3%)' : 'hsl(180, 50%, 96%)';
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      return;
    }

    const resizeCanvas = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth * resolutionScale;
      canvas.height = innerHeight * resolutionScale;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.scale(resolutionScale, resolutionScale);
    };

    const animate = () => {
      timeRef.current += 0.016 * speed;
      
      const { width, height } = canvas;
      
      // Theme-adaptive background
      ctx.fillStyle = isDark ? 'hsl(180, 100%, 3%)' : 'hsl(180, 50%, 96%)';
      ctx.fillRect(0, 0, width, height);

      // Create flowing wave veil effect with theme adaptation
      ctx.beginPath();
      
      // Draw multiple flowing wave layers like a veil
      for (let layer = 0; layer < 3; layer++) {
        const waveHeight = height * 0.3 * (layer + 1);
        const waveSpeed = speed * (layer + 1) * 0.5;
        const waveFreq = 0.01 * (layer + 1);
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        // Create flowing wave path
        for (let x = 0; x <= width; x += 10) {
          const wave1 = Math.sin(x * waveFreq + timeRef.current * waveSpeed) * waveHeight * 0.3;
          const wave2 = Math.sin(x * waveFreq * 1.5 + timeRef.current * waveSpeed * 1.2) * waveHeight * 0.2;
          const wave3 = Math.sin(x * waveFreq * 0.7 + timeRef.current * waveSpeed * 0.8) * waveHeight * 0.1;
          
          const y = height - waveHeight + wave1 + wave2 + wave3;
          ctx.lineTo(x, y);
        }
        
        // Complete the veil shape
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Theme-adaptive gradient for each veil layer
        const layerGradient = ctx.createLinearGradient(0, height - waveHeight, 0, height);
        const baseOpacity = isDark ? 0.8 - layer * 0.15 : 0.4 - layer * 0.1;
        const hue = 180 + hueShift;
        
        if (isDark) {
          // Dark theme: vibrant teal waves
          layerGradient.addColorStop(0, `hsla(${hue}, 100%, 60%, ${baseOpacity})`);
          layerGradient.addColorStop(0.5, `hsla(${hue}, 90%, 40%, ${baseOpacity * 0.8})`);
          layerGradient.addColorStop(1, `hsla(${hue}, 80%, 20%, ${baseOpacity * 0.6})`);
        } else {
          // Light theme: subtle teal waves
          layerGradient.addColorStop(0, `hsla(${hue}, 70%, 30%, ${baseOpacity})`);
          layerGradient.addColorStop(0.5, `hsla(${hue}, 60%, 45%, ${baseOpacity * 0.7})`);
          layerGradient.addColorStop(1, `hsla(${hue}, 50%, 60%, ${baseOpacity * 0.5})`);
        }
        
        ctx.fillStyle = layerGradient;
        ctx.fill();
      }

      // Add dramatic noise effect
      if (noiseIntensity > 0) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * noiseIntensity * 50;
          const tealNoise = (Math.random() - 0.5) * noiseIntensity * 20;
          data[i] = Math.max(0, Math.min(255, data[i] + noise)); // Red
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise + tealNoise)); // Green (enhanced for teal)
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise + tealNoise)); // Blue (enhanced for teal)
        }
        
        ctx.putImageData(imageData, 0, 0);
      }

      // Add flowing fabric texture to the veil with theme adaptation
      if (scanlineIntensity > 0) {
        ctx.globalAlpha = scanlineIntensity * (isDark ? 0.3 : 0.2);
        
        // Create horizontal fabric threads that follow the wave motion
        for (let y = height * 0.5; y < height; y += 15) {
          ctx.beginPath();
          
          // Theme-adaptive thread color
          if (isDark) {
            ctx.strokeStyle = `hsl(${180 + hueShift}, 90%, 60%)`;
          } else {
            ctx.strokeStyle = `hsl(${180 + hueShift}, 60%, 40%)`;
          }
          
          ctx.lineWidth = 1;
          
          for (let x = 0; x <= width; x += 5) {
            const waveOffset = Math.sin(x * 0.02 + timeRef.current * speed) * 3;
            const threadY = y + waveOffset + Math.sin(timeRef.current * 2 + x * 0.01) * 2;
            
            if (x === 0) {
              ctx.moveTo(x, threadY);
            } else {
              ctx.lineTo(x, threadY);
            }
          }
          ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount, resolutionScale, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${
        isDark ? 'opacity-90' : 'opacity-60'
      }`}
      style={{
        background: isDark 
          ? 'linear-gradient(to bottom, hsl(180, 100%, 8%) 0%, hsl(180, 80%, 15%) 100%)'
          : 'linear-gradient(to bottom, hsl(180, 30%, 95%) 0%, hsl(180, 20%, 90%) 100%)',
        mixBlendMode: 'normal',
      }}
    />
  );
}