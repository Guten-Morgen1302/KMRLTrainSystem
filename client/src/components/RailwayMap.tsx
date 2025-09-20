import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Station, TrackSegment, Platform, Signal, Train, TrainCar, DepotInfrastructure, MapData, TrainData } from '@shared/schema';

interface ViewTransform {
  x: number;
  y: number;
  scale: number;
}

interface LayerVisibility {
  tracks: boolean;
  platforms: boolean;
  signals: boolean;
  trains: boolean;
  infrastructure: boolean;
  labels: boolean;
}

interface TooltipData {
  content: React.ReactNode;
  x: number;
  y: number;
}

// Using types from shared schema - remove local interface definitions

// Professional color scheme for government standard UI
const THEME = {
  primary: '#1e40af',
  secondary: '#64748b',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  track: '#374151',
  platform: '#e5e7eb',
  depot: '#f3f4f6',
  signal: {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    off: '#6b7280'
  }
};

export default function RailwayMap() {
  // State management
  const [transform, setTransform] = useState<ViewTransform>({ x: 0, y: 0, scale: 1 });
  const [viewBox, setViewBox] = useState<string>("0 0 1400 400");
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    tracks: true,
    platforms: true,
    signals: true,
    trains: true,
    infrastructure: true,
    labels: true
  });
  const [hoveredElement, setHoveredElement] = useState<TooltipData | null>(null);
  const [focusedTrainId, setFocusedTrainId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastUpdate, setLastUpdate] = useState<string>('');
  
  // Dynamic statistics state
  const [liveStats, setLiveStats] = useState({
    activeTrains: 2,
    readyForService: 1, 
    maintenanceBays: 0,
    signalPoints: 3
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<SVGGElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Calculate proper viewBox based on core content bounds
  useEffect(() => {
    const calculateViewBox = () => {
      if (coreRef.current && containerRef.current) {
        try {
          const bbox = coreRef.current.getBBox();
          const padding = 20;
          const containerHeight = 200; // Fixed height
          const containerWidth = containerRef.current.clientWidth || 800;
          
          const vbX = bbox.x - padding;
          const vbW = bbox.width + 2 * padding;
          const vbH = vbW * (containerHeight / containerWidth);
          const vbY = bbox.y + bbox.height/2 - vbH/2; // Center core vertically
          
          setViewBox(`${vbX} ${vbY} ${vbW} ${vbH}`);
        } catch (err) {
          // Fallback if getBBox fails
          setViewBox("50 240 1300 300");
        }
      }
    };

    // Calculate on mount and after a short delay for content to render
    const timer = setTimeout(calculateViewBox, 100);
    return () => clearTimeout(timer);
  }, [layerVisibility]); // Recalculate when layers change

  // Auto-update statistics every 15 seconds
  useEffect(() => {
    const updateStats = () => {
      // Generate realistic dynamic values based on railway operations
      const baseActiveTrains = Math.floor(Math.random() * 8) + 15; // 15-23 trains
      const readyTrains = Math.floor(Math.random() * 4) + 1; // 1-5 ready
      const maintenanceBays = Math.floor(Math.random() * 3); // 0-2 maintenance 
      const totalSignals = 25 + Math.floor(Math.random() * 10); // 25-35 signals
      
      setLiveStats({
        activeTrains: baseActiveTrains,
        readyForService: readyTrains,
        maintenanceBays: maintenanceBays, 
        signalPoints: totalSignals
      });
      
      // Update timestamp
      setLastUpdate(new Date().toLocaleTimeString());
    };
    
    // Update immediately, then every 15 seconds
    updateStats();
    const interval = setInterval(updateStats, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // API data state
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [trainData, setTrainData] = useState<TrainData | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [mapResponse, trainResponse] = await Promise.all([
          fetch('/api/map'),
          fetch('/api/trains')
        ]);

        if (!mapResponse.ok || !trainResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const mapData = await mapResponse.json();
        const trainData = await trainResponse.json();

        setMapData(mapData);
        setTrainData(trainData);
        setHasError(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract data from API responses
  const stations = mapData?.stations || [];
  const trackSegments = mapData?.trackSegments || [];
  const platforms = mapData?.platforms || [];
  const signals = mapData?.signals || [];
  const depotInfrastructure = mapData?.depotInfrastructure || [];
  const trains = trainData?.trains || [];
  const trainCars = trainData?.trainCars || [];

  // Static train status update function (for demo purposes)
  const updateTrainStatus = (trainId: string, status: string) => {
    console.log(`Train ${trainId} status updated to: ${status}`);
    // In a fully frontend app, this would update local state
  };

  // Pan and zoom handlers
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (!svgRef.current) return;
    event.preventDefault();

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const scaleFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.5, Math.min(3, transform.scale * scaleFactor));

    setTransform(prev => ({
      ...prev,
      scale: newScale,
      x: prev.x + (centerX - prev.x) * (1 - scaleFactor),
      y: prev.y + (centerY - prev.y) * (1 - scaleFactor)
    }));
  }, [transform.scale]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: event.clientX - transform.x, y: event.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    const newScale = Math.min(3, transform.scale * 1.2);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.5, transform.scale * 0.8);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handleResetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  // Layer toggle
  const toggleLayer = (layer: keyof LayerVisibility) => {
    setLayerVisibility(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Enhanced track rendering with realistic curves and switches
  const renderTrackSegment = (segment: TrackSegment) => {
    const strokeWidth = segment.isMainLine ? 4 : 3;
    const color = segment.isMainLine ? THEME.track : THEME.secondary;
    
    // Create double rail effect by rendering two parallel lines
    const offset = 3;
    
    return (
      <g key={segment.id} data-testid={`track-${segment.id}`}>
        {/* Main track line */}
        <path
          d={segment.pathData}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Parallel rail line for double track effect */}
        <path
          d={segment.pathData}
          stroke={color}
          strokeWidth={strokeWidth - 1}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(0, ${offset})`}
          opacity={0.7}
        />
        
        {/* Railway sleepers for main tracks */}
        {segment.isMainLine && (
          <g opacity={0.6}>
            {Array.from({ length: 20 }, (_, i) => (
              <line
                key={i}
                x1={100 + i * 40}
                y1={parseFloat(segment.pathData.match(/M\s*\d+\.?\d*\s+(\d+\.?\d*)/)?.[1] || '300') - 8}
                x2={100 + i * 40}
                y2={parseFloat(segment.pathData.match(/M\s*\d+\.?\d*\s+(\d+\.?\d*)/)?.[1] || '300') + 8}
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            ))}
          </g>
        )}
        
        {/* Switch indicator for junction tracks */}
        {segment.type === 'switch' && (
          <circle
            cx={parseFloat(segment.pathData.match(/M\s*(\d+\.?\d*)/)?.[1] || '0')}
            cy={parseFloat(segment.pathData.match(/M\s*\d+\.?\d*\s+(\d+\.?\d*)/)?.[1] || '0')}
            r="8"
            fill={THEME.warning}
            stroke="white"
            strokeWidth="2"
          />
        )}
      </g>
    );
  };

  // Multi-car train rendering with realistic proportions
  const renderTrain = (train: Train) => {
    const trainCarsForTrain = trainCars.filter(car => car.trainId === train.id);
    const carCount = train.consist || trainCarsForTrain.length || 3;
    const carLength = 18;
    const carWidth = 8;
    const carGap = 2;
    const totalLength = carCount * carLength + (carCount - 1) * carGap;

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Standby': return THEME.success;
        case 'IBL': return THEME.warning;
        case 'Induct': return THEME.danger;
        case 'Service': return THEME.primary;
        case 'Cleaning': return '#8b5cf6';
        case 'Maintenance': return THEME.secondary;
        default: return THEME.secondary;
      }
    };

    return (
      <g
        key={train.id}
        role="button"
        tabIndex={0}
        aria-label={`Train ${train.name} - ${train.status} - Cars: ${carCount}`}
        className="cursor-pointer focus:outline-none"
        onMouseEnter={(e) => handleTrainHover(train, e)}
        onMouseLeave={() => setHoveredElement(null)}
        onClick={() => setFocusedTrainId(focusedTrainId === train.id ? null : train.id)}
        onKeyDown={(e) => handleTrainKeyDown(e, train)}
        data-testid={`train-${train.id}`}
        style={{
          transition: prefersReducedMotion ? 'none' : 'all 0.3s ease'
        }}
      >
        {/* Render each car in the consist */}
        {Array.from({ length: carCount }, (_, index) => {
          const carX = parseFloat(train.x) + index * (carLength + carGap);
          const carY = parseFloat(train.y);
          const isMotorCar = index === 0 || index === carCount - 1;

          return (
            <g key={`${train.id}-car-${index}`}>
              {/* Car body */}
              <rect
                x={carX}
                y={carY}
                width={carLength}
                height={carWidth}
                rx="2"
                fill={getStatusColor(train.status)}
                stroke="white"
                strokeWidth="1"
                opacity={focusedTrainId === train.id ? 0.9 : 0.8}
                style={{
                  filter: focusedTrainId === train.id ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' : 'none'
                }}
              />
              
              {/* Motor car indicator */}
              {isMotorCar && (
                <rect
                  x={carX + 2}
                  y={carY + 2}
                  width={carLength - 4}
                  height={carWidth - 4}
                  rx="1"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray="2,1"
                />
              )}
              
              {/* Car windows */}
              <rect
                x={carX + 3}
                y={carY + 1}
                width={carLength - 6}
                height={2}
                fill="rgba(255,255,255,0.6)"
                rx="0.5"
              />
              
              {/* Car number for first car */}
              {index === 0 && (
                <text
                  x={carX + carLength / 2}
                  y={carY + carWidth / 2 + 2}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-white pointer-events-none"
                >
                  {train.name}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Direction arrow */}
        <polygon
          points={`${parseFloat(train.x) + totalLength + 5},${parseFloat(train.y) + carWidth/2} ${parseFloat(train.x) + totalLength + 10},${parseFloat(train.y) + carWidth/2 - 2} ${parseFloat(train.x) + totalLength + 10},${parseFloat(train.y) + carWidth/2 + 2}`}
          fill={getStatusColor(train.status)}
          opacity={0.8}
        />
        
        {/* Status indicator with leader line */}
        <g>
          {/* Arrow going UP only, not crossing middle */}
          <line
            x1={parseFloat(train.x) + totalLength / 2}
            y1={parseFloat(train.y) - 2}
            x2={parseFloat(train.x) + totalLength / 2}
            y2="240"
            stroke="#555"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          {/* Status text spread with massive spacing */}
          <text
            x={200 + (trains.findIndex(t => t.id === train.id) * 180)}
            y={parseFloat(train.y) - 10}
            textAnchor="middle"
            className="text-lg font-bold fill-gray-800 pointer-events-none"
            style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}
          >
            {train.status}
          </text>
        </g>
      </g>
    );
  };

  // Professional signal rendering with colored aspects
  const renderSignal = (signal: Signal) => {
    const aspectColor = THEME.signal[signal.aspect as keyof typeof THEME.signal] || THEME.signal.off;
    
    return (
      <g key={signal.id} data-testid={`signal-${signal.id}`}>
        {/* Signal mast */}
        <line
          x1={parseFloat(signal.x)}
          y1={parseFloat(signal.y) - 15}
          x2={parseFloat(signal.x)}
          y2={parseFloat(signal.y) + 5}
          stroke={THEME.secondary}
          strokeWidth="2"
        />
        
        {/* Signal head */}
        <circle
          cx={parseFloat(signal.x)}
          cy={parseFloat(signal.y) - 8}
          r="4"
          fill={aspectColor}
          stroke="white"
          strokeWidth="1"
        />
        
        {/* Signal type indicator with leader line */}
        {layerVisibility.labels && (
          <g>
            {/* Arrow going UP only, not crossing middle */}
            <line
              x1={parseFloat(signal.x)}
              y1={parseFloat(signal.y) - 8}
              x2={parseFloat(signal.x)}
              y2={parseFloat(signal.y) - 12}
              stroke="#888"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            {/* Signal type label spread with huge spacing */}
            <text
              x={150 + (signals.findIndex(s => s.id === signal.id) * 200)}
              y={parseFloat(signal.y) - 15}
              textAnchor="middle"
              className="text-lg font-bold fill-gray-600"
              style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}
            >
              {signal.type.toUpperCase()}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Enhanced platform rendering
  const renderPlatform = (platform: Platform) => {
    const platformColor = platform.platformType === 'maintenance' ? '#fef3c7' : 
                         platform.platformType === 'depot' ? '#f3f4f6' : THEME.platform;
    
    return (
      <g key={platform.id} data-testid={`platform-${platform.id}`}>
        <rect
          x={parseFloat(platform.x)}
          y={parseFloat(platform.y)}
          width={parseFloat(platform.width)}
          height={parseFloat(platform.height)}
          fill={platformColor}
          stroke={THEME.secondary}
          strokeWidth="1"
          rx="2"
        />
        
        {/* Platform edge marking */}
        <line
          x1={parseFloat(platform.x)}
          y1={parseFloat(platform.y)}
          x2={parseFloat(platform.x) + parseFloat(platform.width)}
          y2={parseFloat(platform.y)}
          stroke="#fbbf24"
          strokeWidth="2"
        />
        
        {layerVisibility.labels && (
          <g>
            {/* Long leader line to bottom area */}
            <line
              x1={parseFloat(platform.x) + parseFloat(platform.width) / 2}
              y1={parseFloat(platform.y) + parseFloat(platform.height)}
              x2={parseFloat(platform.x) + parseFloat(platform.width) / 2}
              y2={parseFloat(platform.y) + parseFloat(platform.height) + 15}
              stroke="#999"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            {/* Platform name spread with more spacing to avoid overlap */}
            <text
              x={120 + (platforms.findIndex(p => p.id === platform.id) % 4) * 200}
              y={parseFloat(platform.y) + parseFloat(platform.height) + 20}
              textAnchor="middle"
              className="text-lg font-bold fill-gray-700"
              style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}
            >
              {platform.name}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Infrastructure rendering with detailed buildings
  const renderInfrastructure = (infra: DepotInfrastructure) => {
    const infraColor = infra.type === 'wash_plant' ? '#dbeafe' :
                      infra.type === 'maintenance_shed' ? '#fef3c7' : '#f3f4f6';
    
    return (
      <g key={infra.id} data-testid={`infrastructure-${infra.id}`}>
        {/* Building structure */}
        <rect
          x={parseFloat(infra.x)}
          y={parseFloat(infra.y)}
          width={parseFloat(infra.width || '20')}
          height={parseFloat(infra.height || '15')}
          fill={infraColor}
          stroke={THEME.secondary}
          strokeWidth="1"
          rx="3"
          opacity={0.8}
        />
        
        {/* Roof detail */}
        <polygon
          points={`${parseFloat(infra.x) - 2},${parseFloat(infra.y)} ${parseFloat(infra.x) + parseFloat(infra.width || '20') / 2},${parseFloat(infra.y) - 5} ${parseFloat(infra.x) + parseFloat(infra.width || '20') + 2},${parseFloat(infra.y)}`}
          fill={THEME.secondary}
          opacity={0.6}
        />
        
        {layerVisibility.labels && (
          <g>
            {/* Arrow going DOWN only, not crossing middle */}
            <line
              x1={parseFloat(infra.x) + parseFloat(infra.width || '20') / 2}
              y1={parseFloat(infra.y) + parseFloat(infra.height || '15')}
              x2={parseFloat(infra.x) + parseFloat(infra.width || '20') / 2}
              y2={parseFloat(infra.y) + parseFloat(infra.height || '15') + 15}
              stroke="#777"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            {/* Infrastructure name spread with huge spacing */}
            <text
              x={150 + (depotInfrastructure.findIndex(d => d.id === infra.id) % 3) * 250}
              y={parseFloat(infra.y) + parseFloat(infra.height || '15') + 20}
              textAnchor="middle"
              className="text-lg font-bold fill-gray-700"
              style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}
            >
              {infra.name}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Overhead lines rendering
  const renderOverheadLines = () => {
    return (
      <g opacity={0.4}>
        {trackSegments.filter(t => t.isMainLine).map(track => (
          <path
            key={`oh-${track.id}`}
            d={track.pathData}
            stroke="#94a3b8"
            strokeWidth="1"
            fill="none"
            strokeDasharray="10,5"
            transform="translate(0, -20)"
          />
        ))}
      </g>
    );
  };

  // Event handlers
  const handleTrainHover = (train: Train, event: React.MouseEvent) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    setHoveredElement({
      content: (
        <div className="space-y-2">
          <div className="font-bold text-white">{train.name}</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <div>Status: <span className="text-white">{train.status}</span></div>
            <div>Operator: <span className="text-white">{train.operator}</span></div>
            <div>Consist: <span className="text-white">{train.consist} cars</span></div>
            <div>Energy: <span className="text-white">{train.energyLevel}%</span></div>
            <div>Mileage: <span className="text-white">{train.mileage}</span></div>
            <div>Fitness: <span className="text-white">{train.fitnessExpiry}</span></div>
          </div>
        </div>
      ),
      x: event.clientX - rect.left + 10,
      y: event.clientY - rect.top - 10
    });
  };

  const handleTrainKeyDown = (event: React.KeyboardEvent, train: Train) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setFocusedTrainId(focusedTrainId === train.id ? null : train.id);
    }
  };

  // Update notification
  useEffect(() => {
    if (trains.length > 0) {
      const randomTrain = trains[Math.floor(Math.random() * trains.length)];
      setLastUpdate(`System updated: ${trains.length} trains tracked - Latest: ${randomTrain.name}`);
    }
  }, [trains]);

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Metro Yukthi - Railway Control System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-80 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (hasError) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            System Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">
            Failed to load railway system data. Please check network connection.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white border border-gray-200 shadow-lg">
      {/* Live update region for screen readers */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        data-testid="live-region-trains"
      >
        {lastUpdate || `Railway control system active - ${trains.length} trains monitored`}
      </div>

      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Activity className="h-6 w-6 text-blue-600" />
            Metro Yukthi - Railway Control System
            <Badge variant="outline" className="ml-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          </CardTitle>
          
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomIn}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomOut}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetView}
              data-testid="button-reset-view"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-2">
        {/* Layer controls */}
        <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mr-2">Layers:</div>
          {Object.entries(layerVisibility).map(([layer, visible]) => (
            <div key={layer} className="flex items-center space-x-2">
              <Switch
                id={`layer-${layer}`}
                checked={visible}
                onCheckedChange={() => toggleLayer(layer as keyof LayerVisibility)}
                data-testid={`switch-layer-${layer}`}
              />
              <label 
                htmlFor={`layer-${layer}`}
                className="text-sm font-medium text-gray-600 capitalize cursor-pointer"
              >
                {layer}
              </label>
              {visible ? (
                <Eye className="h-3 w-3 text-gray-400" />
              ) : (
                <EyeOff className="h-3 w-3 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Main map container */}
        <div 
          ref={containerRef}
          className="relative bg-white border border-gray-200 rounded-lg overflow-hidden"
          style={{ height: '200px' }}
        >
          <svg
            ref={svgRef}
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full cursor-move"
            role="img"
            aria-label="Professional railway control system map showing real-time train positions and infrastructure"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Background grid and arrow markers */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                </pattern>
                {/* Arrow marker for leader lines */}
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                </marker>
              </defs>
              <rect width="900" height="300" x="50" y="200" fill="url(#grid)" />

              {/* Overhead lines */}
              {layerVisibility.infrastructure && renderOverheadLines()}

              {/* Core content group for centering - tracks and stations only */}
              <g ref={coreRef}>
                {/* Render track segments */}
                {layerVisibility.tracks && trackSegments.map(renderTrackSegment)}

                {/* Render stations */}
                {stations.map((station) => (
                <g key={station.id}>
                  <circle
                    cx={parseFloat(station.x)}
                    cy={parseFloat(station.y)}
                    r={station.isHighlighted ? "15" : "10"}
                    fill={station.isDepot ? THEME.warning : THEME.primary}
                    stroke="white"
                    strokeWidth="3"
                    data-testid={`station-${station.id}`}
                  />
                  
                  {layerVisibility.labels && (
                    <g>
                      {/* Long leader line spread to top area */}
                      <line
                        x1={parseFloat(station.x)}
                        y1={parseFloat(station.y) - 15}
                        x2={parseFloat(station.x)}
                        y2={185 + Math.floor(stations.findIndex(s => s.id === station.id) / 5) * 20 + 5}
                        stroke="#666"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                      {/* Station name spread with multiple rows to avoid overlap */}
                      <text
                        x={80 + (stations.findIndex(s => s.id === station.id) % 5) * 180}
                        y={185 + Math.floor(stations.findIndex(s => s.id === station.id) / 5) * 20}
                        textAnchor="middle"
                        className={`text-xl font-bold ${
                          station.isHighlighted ? 'fill-gray-800' : 'fill-gray-600'
                        }`}
                        style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}
                      >
                        {station.name}
                      </text>
                    </g>
                  )}
                  
                  {station.isHighlighted && (
                    <circle
                      cx={parseFloat(station.x)}
                      cy={parseFloat(station.y)}
                      r="25"
                      fill="none"
                      stroke={THEME.warning}
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity={0.7}
                    />
                  )}
                </g>
              ))}
              </g>

              {/* Render platforms */}
              {layerVisibility.platforms && platforms.map(renderPlatform)}

              {/* Render signals */}
              {layerVisibility.signals && signals.map(renderSignal)}

              {/* Render infrastructure */}
              {layerVisibility.infrastructure && depotInfrastructure.map(renderInfrastructure)}

              {/* Render trains */}
              {layerVisibility.trains && trains.map(renderTrain)}
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredElement && (
            <div
              className="absolute z-10 bg-black text-white p-4 rounded-lg text-sm shadow-xl pointer-events-none max-w-xs"
              style={{
                left: hoveredElement.x,
                top: hoveredElement.y,
                transform: 'translateY(-100%)'
              }}
              role="tooltip"
            >
              {hoveredElement.content}
            </div>
          )}
        </div>

        {/* System status and legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status legend */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Train Status Legend</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { status: 'Standby', color: THEME.success, description: 'Ready for service' },
                { status: 'Service', color: THEME.primary, description: 'In passenger service' },
                { status: 'Induct', color: THEME.danger, description: 'Under maintenance' },
                { status: 'IBL', color: THEME.warning, description: 'Inspection & testing' },
                { status: 'Cleaning', color: '#8b5cf6', description: 'Cleaning operations' },
                { status: 'Maintenance', color: THEME.secondary, description: 'Scheduled maintenance' }
              ].map(({ status, color, description }) => (
                <div key={status} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-3 rounded-sm" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-700">{status}</div>
                    <div className="text-xs text-gray-500">{description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live statistics */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">System Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-target">
                <div className="text-2xl font-bold text-blue-600 animate-pulse">{liveStats.activeTrains}</div>
                <div className="text-sm text-blue-600">Active Trains</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-target">
                <div className="text-2xl font-bold text-green-600 animate-pulse">{liveStats.readyForService}</div>
                <div className="text-sm text-green-600">Ready for Service</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-target">
                <div className="text-2xl font-bold text-yellow-600 animate-pulse">{liveStats.maintenanceBays}</div>
                <div className="text-sm text-yellow-600">Maintenance Bays</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-target">
                <div className="text-2xl font-bold text-purple-600 animate-pulse">{liveStats.signalPoints}</div>
                <div className="text-sm text-purple-600">Signal Points</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}