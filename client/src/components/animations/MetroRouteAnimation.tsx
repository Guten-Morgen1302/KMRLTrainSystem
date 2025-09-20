import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MotionTokens, getReducedMotionVariant, MotionColors } from '@/lib/motion';

interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  isDepot?: boolean;
  isHighlighted?: boolean;
}

// Complete Kochi Metro Line 1 stations - Full Network
const stations: Station[] = [
  { id: 'aluva', name: 'Aluva', x: 40, y: 150 },
  { id: 'pulinchodu', name: 'Pulinchodu', x: 100, y: 145 },
  { id: 'companypady', name: 'Companypady', x: 160, y: 140 },
  { id: 'ambattukavu', name: 'Ambattukavu', x: 220, y: 135 },
  { id: 'muttom', name: 'Muttom', x: 280, y: 130, isDepot: true, isHighlighted: true },
  { id: 'kalamassery', name: 'Kalamassery', x: 340, y: 135 },
  { id: 'cusat', name: 'Cochin University', x: 400, y: 140 },
  { id: 'pathadipalam', name: 'Pathadipalam', x: 460, y: 145 },
  { id: 'jlnstadium', name: 'JLN Stadium', x: 520, y: 150 },
  { id: 'maharajas', name: 'Maharajas', x: 580, y: 155 },
  { id: 'ernakulamsouth', name: 'Ernakulam South', x: 640, y: 160 },
  { id: 'kadavanthra', name: 'Kadavanthra', x: 700, y: 165 },
  { id: 'elamkulam', name: 'Elamkulam', x: 760, y: 170 },
  { id: 'vyttila', name: 'Vyttila', x: 820, y: 175 },
  { id: 'thykoodam', name: 'Thykoodam', x: 880, y: 180 },
  { id: 'petta', name: 'Petta', x: 940, y: 185 },
];

// Generate smooth curve path through stations
const generateRoutePath = (stations: Station[]) => {
  if (stations.length < 2) return '';
  
  let path = `M ${stations[0].x} ${stations[0].y}`;
  
  for (let i = 1; i < stations.length; i++) {
    const prev = stations[i - 1];
    const curr = stations[i];
    const next = stations[i + 1];
    
    if (next) {
      // Smooth curve through current point
      const cp1x = prev.x + (curr.x - prev.x) * 0.7;
      const cp1y = prev.y + (curr.y - prev.y) * 0.7;
      const cp2x = curr.x - (next.x - curr.x) * 0.3;
      const cp2y = curr.y - (next.y - curr.y) * 0.3;
      
      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`;
    } else {
      // Straight line to last point
      path += ` L ${curr.x} ${curr.y}`;
    }
  }
  
  return path;
};

const routePath = generateRoutePath(stations);

export default function MetroRouteAnimation() {
  const trainControls = useAnimation();
  const pathRef = useRef<SVGPathElement>(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const animateTrainJourney = async () => {
      // Start train journey with smooth motion using CSS offsetDistance property
      await trainControls.start({
        transition: {
          duration: 12,
          ease: MotionTokens.easing.metro,
          repeat: Infinity,
          repeatDelay: 2,
        }
      });
    };

    // Start animation after mount
    const timer = setTimeout(animateTrainJourney, 500);
    return () => clearTimeout(timer);
  }, [trainControls, prefersReducedMotion]);

  const stationPulseVariant = getReducedMotionVariant({
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        ease: MotionTokens.easing.easeInOut,
        repeat: Infinity,
        repeatDelay: Math.random() * 2, // Staggered station pulses
      }
    }
  });

  const trainVariant = getReducedMotionVariant({
    animate: {
      transition: {
        duration: 0,
      }
    }
  });

  return (
    <div 
      className="relative w-full h-96 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
      data-testid="metro-route-animation"
    >
      {/* Background grid for professional look */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}></div>
      </div>

      <svg 
        viewBox="0 0 1020 250" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden={prefersReducedMotion}
        role={prefersReducedMotion ? undefined : "img"}
        aria-label={prefersReducedMotion ? undefined : "Complete Metro Yukthi train route showing all 16 stations from Aluva to Petta with live train movement"}
      >
        {/* Route Path */}
        <motion.path
          ref={pathRef}
          id="metro-route"
          d={routePath}
          fill="none"
          stroke={MotionColors.primary}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="0"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 2,
            ease: MotionTokens.easing.easeOut,
          }}
        />

        {/* Secondary track for depth */}
        <path
          d={routePath}
          fill="none"
          stroke={MotionColors.primaryLight}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.4"
          transform="translate(0, 3)"
        />

        {/* Stations */}
        {stations.map((station, index) => (
          <g key={station.id}>
            {/* Station pulse animation */}
            <motion.circle
              cx={station.x}
              cy={station.y}
              r="15"
              fill={station.isDepot ? MotionColors.warning : MotionColors.primary}
              opacity="0.4"
              variants={stationPulseVariant}
              animate="animate"
              style={{ 
                animationDelay: `${index * 0.5}s`
              }}
            />
            
            {/* Station base */}
            <circle
              cx={station.x}
              cy={station.y}
              r="8"
              fill={station.isDepot ? MotionColors.warning : MotionColors.primary}
              stroke="white"
              strokeWidth="3"
            />
            
            {/* Depot indicator */}
            {station.isDepot && (
              <motion.circle
                cx={station.x}
                cy={station.y}
                r="3"
                fill="white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 2 + index * 0.1,
                  duration: MotionTokens.duration.normal,
                  ease: MotionTokens.easing.bounce,
                }}
              />
            )}

            {/* Station name - alternating above/below to prevent overlap */}
            <text
              x={station.x}
              y={index % 2 === 0 ? station.y - 25 : station.y + 35}
              textAnchor="middle"
              className="text-sm font-bold fill-slate-800 dark:fill-slate-200"
              style={{ pointerEvents: 'none' }}
              fontSize="12"
            >
              {station.name}
            </text>
          </g>
        ))}

        {/* Animated Train */}
        <motion.g
          animate={{
            offsetDistance: prefersReducedMotion ? '0%' : ['0%', '100%']
          }}
          style={{
            offsetPath: `path('${routePath}')`,
            offsetRotate: 'auto',
            offsetDistance: '0%'
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 12,
            ease: MotionTokens.easing.metro,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          {/* Train body - 3 car consist */}
          <g transform="translate(-15, -4)">
            {/* Car 1 */}
            <rect
              x="0" y="0" width="8" height="8" rx="2"
              fill={MotionColors.primary}
              stroke="white" strokeWidth="1"
            />
            {/* Car 2 */}
            <rect
              x="10" y="0" width="8" height="8" rx="2"
              fill={MotionColors.primary}
              stroke="white" strokeWidth="1"
            />
            {/* Car 3 */}
            <rect
              x="20" y="0" width="8" height="8" rx="2"
              fill={MotionColors.primary}
              stroke="white" strokeWidth="1"
            />
            
            {/* Train windows */}
            <rect x="1" y="1" width="6" height="2" fill="rgba(255,255,255,0.8)" rx="1" />
            <rect x="11" y="1" width="6" height="2" fill="rgba(255,255,255,0.8)" rx="1" />
            <rect x="21" y="1" width="6" height="2" fill="rgba(255,255,255,0.8)" rx="1" />

            {/* Direction indicator */}
            <motion.circle
              cx="32" cy="4"
              r="2"
              fill={MotionColors.success}
              animate={prefersReducedMotion ? { opacity: 1 } : {
                opacity: [0.5, 1, 0.5],
              }}
              transition={prefersReducedMotion ? { duration: 0 } : {
                duration: 1,
                repeat: Infinity,
                ease: MotionTokens.easing.easeInOut,
              }}
            />
          </g>
        </motion.g>

        {/* Status indicators - moved to avoid overlap */}
        <g transform="translate(80, 30)">
          <rect x="0" y="0" width="200" height="60" rx="8" 
                fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
          
          <text x="100" y="18" textAnchor="middle" className="text-sm font-bold fill-slate-800">
            🚀 Metro Yukthi System
          </text>
          
          <circle cx="20" cy="35" r="4" fill={MotionColors.success} />
          <text x="30" y="38" className="text-sm fill-slate-600">System Active</text>
          
          <circle cx="20" cy="48" r="4" fill={MotionColors.primary} />
          <text x="30" y="51" className="text-sm fill-slate-600">Train Moving</text>
        </g>
      </svg>

      {/* Live stats overlay - moved to top-right to avoid station overlap */}
      <div 
        className="absolute top-6 right-6 bg-white/95 dark:bg-slate-800/95 rounded-xl p-4 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-lg"
        data-testid="metro-stats-overlay"
      >
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-center">
            <div className="font-bold text-2xl text-primary">25</div>
            <div className="text-muted-foreground font-medium">Trainsets</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-green-600">18</div>
            <div className="text-muted-foreground font-medium">Active</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-yellow-600">4</div>
            <div className="text-muted-foreground font-medium">Standby</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-orange-600">3</div>
            <div className="text-muted-foreground font-medium">Maintenance</div>
          </div>
        </div>
      </div>
    </div>
  );
}