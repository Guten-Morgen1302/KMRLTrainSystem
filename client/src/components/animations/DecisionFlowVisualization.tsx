import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { MotionTokens, MotionColors, getReducedMotionVariant } from '@/lib/motion';
import { CheckCircle, AlertTriangle, Clock, Zap, Train } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Train {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'traveling' | 'allocated';
  allocation?: 'INDUCT' | 'STANDBY' | 'IBL';
  constraints?: string[];
  processingTime?: number;
  travelPath?: string;
  allocationReason?: string;
  instanceId?: string;
}

interface TravelingTrain {
  train: Train;
  startTime: number;
  endTime: number;
  pathId: string;
  uniqueId: string;
}

const initialTrains: Train[] = [
  { id: 't1', name: 'K-01', status: 'queued', constraints: [] },
  { id: 't2', name: 'K-02', status: 'queued', constraints: ['fitness_expiry'] },
  { id: 't3', name: 'K-03', status: 'queued', constraints: [] },
  { id: 't4', name: 'K-04', status: 'queued', constraints: ['maintenance_due'] },
  { id: 't5', name: 'K-05', status: 'queued', constraints: [] },
  { id: 't6', name: 'K-06', status: 'queued', constraints: ['cleaning_required'] },
];

const constraintReasons = {
  fitness_expiry: { allocation: 'IBL' as const, reason: 'Fitness certificate expired' },
  maintenance_due: { allocation: 'IBL' as const, reason: 'Scheduled maintenance due' },
  cleaning_required: { allocation: 'IBL' as const, reason: 'Deep cleaning required' },
  inspection_overdue: { allocation: 'IBL' as const, reason: 'Safety inspection overdue' },
  repair_needed: { allocation: 'IBL' as const, reason: 'Minor repairs needed' },
};

const defaultReasons = {
  INDUCT: 'Ready for revenue service',
  STANDBY: 'Available as backup unit',
  IBL: 'Routine inspection required',
};

// SVG path definitions for train movement
const svgPaths = {
  queueToEngine: 'M 80 120 Q 140 80 200 120',
  engineToInduct: 'M 220 120 Q 280 60 360 80',
  engineToStandby: 'M 220 120 Q 280 120 360 120',
  engineToIBL: 'M 220 120 Q 280 180 360 160',
};

// Pure helper functions to avoid temporal dead zone
function determineAllocation(train: Train): { allocation: 'INDUCT' | 'STANDBY' | 'IBL', reason: string } {
  // Check for specific constraints first
  if (train.constraints && train.constraints.length > 0) {
    const constraint = train.constraints[0] as keyof typeof constraintReasons;
    if (constraintReasons[constraint]) {
      return {
        allocation: constraintReasons[constraint].allocation,
        reason: constraintReasons[constraint].reason
      };
    }
  }
  
  // Random allocation for trains without constraints
  const random = Math.random();
  if (random < 0.6) {
    return { allocation: 'INDUCT', reason: defaultReasons.INDUCT };
  } else if (random < 0.8) {
    return { allocation: 'STANDBY', reason: defaultReasons.STANDBY };
  } else {
    return { allocation: 'IBL', reason: defaultReasons.IBL };
  }
}

function getPathForAllocation(allocation: 'INDUCT' | 'STANDBY' | 'IBL'): string {
  switch (allocation) {
    case 'INDUCT': return 'engineToInduct';
    case 'STANDBY': return 'engineToStandby';
    case 'IBL': return 'engineToIBL';
    default: return 'engineToInduct';
  }
}

interface DecisionFlowVisualizationProps {
  isActive?: boolean;
  className?: string;
}

export default function DecisionFlowVisualization({ 
  isActive = true, 
  className = '' 
}: DecisionFlowVisualizationProps) {
  const { t } = useTranslation();
  // All useState and useRef hooks first - must be called unconditionally
  const [trains, setTrains] = useState<Train[]>(initialTrains);
  const [currentProcessing, setCurrentProcessing] = useState<string | null>(null);
  const [allocations, setAllocations] = useState<Record<string, Train[]>>({
    INDUCT: [],
    STANDBY: [],
    IBL: [],
  });
  const [travelingTrains, setTravelingTrains] = useState<TravelingTrain[]>([]);
  const [cycleCount, setCycleCount] = useState(0);
  const [allocationCounter, setAllocationCounter] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference - memoized to avoid hook violations
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Animation controls for the decision engine
  const engineControls = useAnimation();

  const startTrainTravel = useCallback((train: Train, allocation: 'INDUCT' | 'STANDBY' | 'IBL', reason: string) => {
    const pathId = getPathForAllocation(allocation);
    const now = Date.now();
    const travelDuration = 5000; // 5 seconds travel time - slowed down for better explanation
    
    // Create unique ID to prevent duplicate keys
    const uniqueId = `${train.id}-${now}-${allocation}-${Math.random().toString(36).substring(7)}`;
    
    const travelingTrain: TravelingTrain = {
      train: { ...train, allocation, allocationReason: reason },
      startTime: now,
      endTime: now + travelDuration,
      pathId,
      uniqueId
    };
    
    setTravelingTrains(prev => [...prev, travelingTrain]);
    
    // Remove from traveling and add to allocation after travel complete
    setTimeout(() => {
      const instanceId = `${train.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setTravelingTrains(prev => prev.filter(t => t.uniqueId !== uniqueId));
      setAllocations(prev => ({
        ...prev,
        [allocation]: [...prev[allocation], { ...train, allocation, allocationReason: reason, instanceId }]
      }));
      setAllocationCounter(prev => prev + 1);
    }, travelDuration);
  }, []);

  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      return;
    }

    const processNextTrain = () => {
      setTrains(currentTrains => {
        const queuedTrains = currentTrains.filter(t => t.status === 'queued');
        if (queuedTrains.length === 0) {
          // Reset cycle after all trains processed
          setTimeout(() => {
            setCycleCount(prev => prev + 1);
            setTrains(initialTrains.map(t => ({ ...t, status: 'queued', allocation: undefined })));
            setAllocations({ INDUCT: [], STANDBY: [], IBL: [] });
            setCurrentProcessing(null);
          }, 3000);
          return currentTrains;
        }

        const trainToProcess = queuedTrains[0];
        setCurrentProcessing(trainToProcess.id);

        // Animate decision engine activation
        engineControls.start({
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 1.5 }
        });

        // Process train after animation
        setTimeout(() => {
          const { allocation, reason } = determineAllocation(trainToProcess);
          
          setTrains(prev => prev.map(t => 
            t.id === trainToProcess.id 
              ? { ...t, status: 'traveling', allocation, allocationReason: reason }
              : t
          ));

          // Start train travel animation
          startTrainTravel(trainToProcess, allocation, reason);
          setCurrentProcessing(null);
        }, 3000);

        return currentTrains.map(t => 
          t.id === trainToProcess.id 
            ? { ...t, status: 'processing' }
            : t
        );
      });
    };

    const interval = setInterval(processNextTrain, 6000);
    intervalRef.current = interval;

    // Start first train immediately
    setTimeout(processNextTrain, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, cycleCount, engineControls, prefersReducedMotion, startTrainTravel]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'INDUCT': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'STANDBY': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'IBL': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Zap className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INDUCT': return 'from-green-500 to-green-600';
      case 'STANDBY': return 'from-yellow-500 to-yellow-600';
      case 'IBL': return 'from-orange-500 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  if (prefersReducedMotion) {
    return (
      <div className={`relative bg-slate-50 dark:bg-slate-900 rounded-lg border p-6 ${className}`} data-testid="decision-flow-static">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2" data-testid="text-engine-title">Metro Yukti Decision Engine</h3>
          <p className="text-sm text-muted-foreground mb-4" data-testid="text-engine-subtitle">
            Intelligent allocation: INDUCT • STANDBY • IBL
          </p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded" data-testid="card-allocation-induct">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" data-testid="icon-induct" />
              <div className="font-medium" data-testid="text-induct-label">INDUCT</div>
              <div className="text-xs text-muted-foreground" data-testid="text-induct-description">Revenue Service</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded" data-testid="card-allocation-standby">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-1" data-testid="icon-standby" />
              <div className="font-medium" data-testid="text-standby-label">STANDBY</div>
              <div className="text-xs text-muted-foreground" data-testid="text-standby-description">Backup Ready</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded" data-testid="card-allocation-ibl">
              <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-1" data-testid="icon-ibl" />
              <div className="font-medium" data-testid="text-ibl-label">IBL</div>
              <div className="text-xs text-muted-foreground" data-testid="text-ibl-description">Maintenance</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 overflow-hidden ${className}`}
      data-testid="decision-flow-animated"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}></div>
      </div>
      
      {/* SVG Path Overlay for Train Movement */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        data-testid="svg-rail-paths"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id="railGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="rgb(99, 102, 241)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection Rails */}
        <path 
          d={svgPaths.queueToEngine} 
          stroke="url(#railGradient)" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="5,5"
          data-testid="rail-queue-to-engine"
        >
          <animate 
            attributeName="stroke-dashoffset" 
            values="0;-10" 
            dur="1s" 
            repeatCount="indefinite"
          />
        </path>
        <path 
          d={svgPaths.engineToInduct} 
          stroke="rgb(34, 197, 94)" 
          strokeWidth="2" 
          fill="none" 
          strokeOpacity="0.5"
          data-testid="rail-engine-to-induct"
        />
        <path 
          d={svgPaths.engineToStandby} 
          stroke="rgb(234, 179, 8)" 
          strokeWidth="2" 
          fill="none" 
          strokeOpacity="0.5"
          data-testid="rail-engine-to-standby"
        />
        <path 
          d={svgPaths.engineToIBL} 
          stroke="rgb(249, 115, 22)" 
          strokeWidth="2" 
          fill="none" 
          strokeOpacity="0.5"
          data-testid="rail-engine-to-ibl"
        />
      </svg>
      
      {/* Traveling Trains Animation */}
      <AnimatePresence>
        {travelingTrains.map((travelingTrain) => (
          <motion.div
            key={travelingTrain.uniqueId}
            className="absolute z-20 pointer-events-none"
            data-testid={`train-traveling-${travelingTrain.train.id}`}
            initial={{ 
              x: 80, 
              y: 120, 
              scale: 0.8, 
              opacity: 0 
            }}
            animate={{ 
              x: travelingTrain.pathId === 'engineToInduct' ? 360 : 
                 travelingTrain.pathId === 'engineToStandby' ? 360 : 
                 travelingTrain.pathId === 'engineToIBL' ? 360 : 200,
              y: travelingTrain.pathId === 'engineToInduct' ? 80 : 
                 travelingTrain.pathId === 'engineToStandby' ? 120 : 
                 travelingTrain.pathId === 'engineToIBL' ? 160 : 120,
              scale: [0.8, 1.1, 1], 
              opacity: [0, 1, 1, 0.8] 
            }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              scale: { times: [0, 0.3, 1] }
            }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/60 via-blue-500/80 to-blue-400/60 rounded-full animate-pulse blur-sm" />
              <div className="absolute -inset-2 bg-blue-400 rounded-full animate-pulse opacity-40" />
              
              {/* Train badge */}
              <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1 border-2 border-white">
                <Train className="w-3 h-3" />
                <span>{travelingTrain.train.name}</span>
              </div>
              
              {/* Destination indicator */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-black/90 text-white px-2 py-1 rounded whitespace-nowrap">
                → {travelingTrain.train.allocation}
              </div>
              
              {/* Trail effect */}
              <motion.div 
                className="absolute top-1/2 right-full transform -translate-y-1/2 w-8 h-1 bg-gradient-to-l from-blue-500 to-transparent rounded-full"
                animate={{ 
                  opacity: [0, 1, 0],
                  scaleX: [0, 1, 0.5]
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-1" data-testid="text-engine-title">{t('demo.live_allocation_title')}</h3>
          <p className="text-sm text-muted-foreground" data-testid="text-engine-subtitle">
            {t('demo.live_allocation_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Input Queue */}
          <div className="space-y-2" data-testid="section-queue">
            <div className="text-sm font-medium text-center mb-3 flex items-center justify-center" data-testid="header-queue">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" data-testid="indicator-queue"></div>
              Queue ({trains.filter(t => t.status === 'queued').length})
            </div>
            <div className="space-y-2 min-h-[200px]" data-testid="container-queue">
              <AnimatePresence>
                {trains.filter(t => t.status === 'queued').map((train, index) => (
                  <motion.div
                    key={`queue-${train.id}-cycle${cycleCount}-index${index}`}
                    className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border text-xs"
                    data-testid={`train-queue-${train.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: MotionTokens.duration.normal 
                    }}
                  >
                    <div className="font-medium" data-testid={`text-train-name-${train.id}`}>{train.name}</div>
                    {train.constraints && train.constraints.length > 0 && (
                      <div className="text-orange-600 text-xs" data-testid={`text-constraint-${train.id}`}>
                        ⚠ {train.constraints[0]}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Decision Engine */}
          <div className="flex flex-col items-center justify-center" data-testid="section-engine">
            <motion.div
              className="relative"
              animate={engineControls}
              data-testid="container-engine"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg" data-testid="button-engine">
                <Zap className="w-8 h-8 text-white" data-testid="icon-engine" />
              </div>
              
              {/* Processing indicator */}
              {currentProcessing && (
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-primary"
                  data-testid={`indicator-processing-${currentProcessing}`}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              )}

              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary"
                data-testid="effect-pulse"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: MotionTokens.easing.easeOut,
                }}
              />
            </motion.div>
            
            <div className="text-xs text-center mt-2 font-medium" data-testid="text-engine-label">
              AI Decision Engine
            </div>
            
            {currentProcessing && (
              <motion.div 
                className="text-xs text-primary mt-1"
                data-testid={`text-processing-${currentProcessing}`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Processing {trains.find(t => t.id === currentProcessing)?.name}...
              </motion.div>
            )}
          </div>

          {/* Output Buckets */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-3 gap-3">
              {(['INDUCT', 'STANDBY', 'IBL'] as const).map(status => (
                <div key={status} className="space-y-2" data-testid={`section-allocation-${status.toLowerCase()}`}>
                  <div className={`text-xs font-medium text-center p-2 rounded bg-gradient-to-r ${getStatusColor(status)} text-white`} data-testid={`header-allocation-${status.toLowerCase()}`}>
                    <div className="flex items-center justify-center mb-1">
                      {getStatusIcon(status)}
                      <span className="ml-1" data-testid={`text-allocation-label-${status.toLowerCase()}`}>{status}</span>
                    </div>
                    <div className="text-xs opacity-90" data-testid={`text-allocation-description-${status.toLowerCase()}`}>
                      {status === 'INDUCT' && 'Revenue Service'}
                      {status === 'STANDBY' && 'Backup Ready'}
                      {status === 'IBL' && 'Maintenance'}
                    </div>
                  </div>
                  
                  <div className="space-y-1 min-h-[140px]" data-testid={`container-allocation-${status.toLowerCase()}`}>
                    <AnimatePresence>
                      {allocations[status].map((train, index) => (
                        <motion.div
                          key={`alloc-${status}-${train.instanceId || `${train.id}-${index}-${cycleCount}`}`}
                          className={`p-2 rounded text-xs border ${
                            status === 'INDUCT' ? 'bg-green-50 dark:bg-green-900/20 border-green-200' :
                            status === 'STANDBY' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200' :
                            'bg-orange-50 dark:bg-orange-900/20 border-orange-200'
                          }`}
                          data-testid={`train-allocated-${train.id}-${status.toLowerCase()}`}
                          initial={{ opacity: 0, scale: 0.8, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            delay: index * 0.1,
                            duration: MotionTokens.duration.smooth,
                            ease: MotionTokens.easing.bounce,
                          }}
                        >
                          <div className="font-medium" data-testid={`text-allocated-train-name-${train.id}`}>{train.name}</div>
                          <div className="text-xs opacity-70" data-testid={`text-allocation-reason-${train.id}`}>
                            {train.allocationReason || defaultReasons[status]}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex justify-center space-x-6 text-xs text-muted-foreground" data-testid="section-stats">
          <div data-testid="stat-cycle">Cycle: {cycleCount + 1}</div>
          <div data-testid="stat-processed">Processed: {Object.values(allocations).flat().length}/6</div>
          <div data-testid="stat-queue">Queue: {trains.filter(t => t.status === 'queued').length}</div>
          <div data-testid="stat-traveling">Traveling: {travelingTrains.length}</div>
        </div>
      </div>
    </div>
  );
}