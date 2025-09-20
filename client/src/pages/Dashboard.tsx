import { useState, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import type { DashboardTrain, Bay, Scenario, Insight, Achievement } from '@shared/schema';
import yellowTrainImg from '../assets/yellow-train.png';
import cyanTrainImg from '../assets/cyan-train.png';

// Animation components
import DarkVeil from '@/components/animations/DarkVeil';
import TargetCursor from '@/components/animations/TargetCursor';
import ScrollProgress from '@/components/animations/ScrollProgress';
import SectionReveal from '@/components/animations/SectionReveal';
import AnimatedText from '@/components/animations/AnimatedText';

// Dashboard Context
interface DashboardContextType {
  revenueBay: DashboardTrain[];
  iblBay: DashboardTrain[];
  standbyBay: DashboardTrain[];
  availableTrains: DashboardTrain[];
  scenarios: Scenario[];
  insights: Insight[];
  achievements: Achievement[];
  score: number;
  isVoiceActive: boolean;
  moveTrain: (trainId: string, fromBay: string, toBay: string, position: { x: number, y: number, bay: number }) => void;
  activateScenario: (scenarioId: string) => void;
  toggleVoice: () => void;
  addScore: (points: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export default function Dashboard() {
  // Bay structure data based on user's sketch
  const [revenueBay, setRevenueBay] = useState<DashboardTrain[]>([
    {
      id: 'K-01',
      name: 'Metro K-01',
      status: 'Service',
      position: { x: 200, y: 80, bay: 1, isDragging: false },
      energyLevel: 95,
      efficiency: 98
    },
    {
      id: 'K-02',
      name: 'Metro K-02', 
      status: 'Service',
      position: { x: 350, y: 80, bay: 2, isDragging: false },
      energyLevel: 92,
      efficiency: 96
    }
  ]);

  const [iblBay, setIblBay] = useState<DashboardTrain[]>([
    {
      id: 'K-03',
      name: 'Metro K-03',
      status: 'IBL',
      position: { x: 250, y: 160, bay: 1, isDragging: false },
      energyLevel: 87,
      efficiency: 92
    }
  ]);

  const [standbyBay, setStandbyBay] = useState<DashboardTrain[]>([
    {
      id: 'K-04',
      name: 'Metro K-04',
      status: 'Standby',
      position: { x: 150, y: 240, bay: 1, isDragging: false },
      energyLevel: 100,
      efficiency: 99
    },
    {
      id: 'K-05',
      name: 'Metro K-05',
      status: 'Standby',
      position: { x: 300, y: 240, bay: 2, isDragging: false },
      energyLevel: 98,
      efficiency: 97
    }
  ]);

  // Available trains for movement
  const [availableTrains, setAvailableTrains] = useState<DashboardTrain[]>([
    {
      id: 'K-06',
      name: 'Metro K-06',
      status: 'Induct',
      position: { x: 100, y: 350, isDragging: false },
      energyLevel: 89,
      efficiency: 94
    },
    {
      id: 'K-07',
      name: 'Metro K-07',
      status: 'Induct',
      position: { x: 250, y: 350, isDragging: false },
      energyLevel: 91,
      efficiency: 95
    }
  ]);

  const [bays] = useState<Bay[]>([
    { id: 'bay-1', index: 1, type: 'INDUCT', capacity: 1, occupiedBy: 'K-03', status: 'occupied', x: '400', y: '100', efficiency: '95' },
    { id: 'bay-2', index: 2, type: 'STANDBY', capacity: 1, occupiedBy: null, status: 'available', x: '200', y: '150', efficiency: '100' },
    { id: 'bay-3', index: 3, type: 'IBL', capacity: 1, occupiedBy: 'K-02', status: 'occupied', x: '250', y: '200', efficiency: '88' }
  ]);

  const [scenarios] = useState<Scenario[]>([
    { id: 'flood', name: 'Monsoon Flood', description: 'Heavy rains affecting depot access', type: 'weather', severity: 'high', effects: '{"disabledBays": [2], "trainDelays": 30}', isActive: false },
    { id: 'breakdown', name: 'Signal Failure', description: 'Main signal system malfunction', type: 'breakdown', severity: 'critical', effects: '{"emergencyMode": true, "maxSpeed": 20}', isActive: false },
    { id: 'vip', name: 'VIP Service', description: 'Special event requiring priority trains', type: 'vip', severity: 'medium', effects: '{"priorityTrains": ["K-01"], "fastTrack": true}', isActive: false }
  ]);

  const [insights] = useState<Insight[]>([
    { id: 'efficiency', metric: 'System Efficiency', value: '94.8', delta: '+2.3', unit: '%', timestamp: new Date(), category: 'efficiency' },
    { id: 'cost', metric: 'Daily Cost Savings', value: '12500', delta: '+1200', unit: '₹', timestamp: new Date(), category: 'cost' },
    { id: 'time', metric: 'Average Turnaround', value: '23', delta: '-5', unit: 'min', timestamp: new Date(), category: 'time' }
  ]);

  const [achievements] = useState<Achievement[]>([
    { id: 'perfect', name: 'Perfect Day', description: '100% efficiency for 24 hours', icon: 'trophy', earned: true, earnedAt: new Date(), points: 500, category: 'efficiency' },
    { id: 'speed', name: 'Speed Demon', description: 'Sub-20 min average turnaround', icon: 'zap', earned: false, earnedAt: null, points: 300, category: 'speed' }
  ]);

  const [score, setScore] = useState(2850);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const moveTrain = (trainId: string, fromBay: string, toBay: string, position: { x: number, y: number, bay: number }) => {
    // Find and remove train from source bay
    const findAndRemoveTrain = (trains: DashboardTrain[]) => {
      const trainIndex = trains.findIndex(t => t.id === trainId);
      if (trainIndex !== -1) {
        const train = trains[trainIndex];
        return { train, remainingTrains: trains.filter(t => t.id !== trainId) };
      }
      return null;
    };

    let trainData = null;
    
    // Remove from source bay
    if (fromBay === 'revenue') {
      trainData = findAndRemoveTrain(revenueBay);
      if (trainData) setRevenueBay(trainData.remainingTrains);
    } else if (fromBay === 'ibl') {
      trainData = findAndRemoveTrain(iblBay);
      if (trainData) setIblBay(trainData.remainingTrains);
    } else if (fromBay === 'standby') {
      trainData = findAndRemoveTrain(standbyBay);
      if (trainData) setStandbyBay(trainData.remainingTrains);
    } else if (fromBay === 'available') {
      trainData = findAndRemoveTrain(availableTrains);
      if (trainData) setAvailableTrains(trainData.remainingTrains);
    }

    // Add to destination bay
    if (trainData) {
      const updatedTrain = {
        ...trainData.train,
        position: { ...position, isDragging: false },
        status: toBay === 'revenue' ? 'Service' : toBay === 'ibl' ? 'IBL' : 'Standby' as any
      };

      if (toBay === 'revenue') {
        setRevenueBay(prev => [...prev, updatedTrain]);
      } else if (toBay === 'ibl') {
        setIblBay(prev => [...prev, updatedTrain]);
      } else if (toBay === 'standby') {
        setStandbyBay(prev => [...prev, updatedTrain]);
      }

      // Add score for successful move
      addScore(50);
    }
  };

  const activateScenario = (scenarioId: string) => {
    console.log('Activating scenario:', scenarioId);
    // Scenario activation logic will be implemented in the scenario component
  };

  const toggleVoice = () => {
    setIsVoiceActive(prev => !prev);
  };

  const addScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const contextValue: DashboardContextType = {
    revenueBay,
    iblBay,
    standbyBay,
    availableTrains,
    scenarios,
    insights,
    achievements,
    score,
    isVoiceActive,
    moveTrain,
    activateScenario,
    toggleVoice,
    addScore
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {/* Background animations */}
      <DarkVeil />
      <TargetCursor />
      <ScrollProgress />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
        {/* Header */}
        <SectionReveal>
          <header className="border-b bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" data-testid="link-back-home">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 cursor-target">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <AnimatedText animation="fadeInUp" delay={200}>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Metro Command Center
                  </h1>
                </AnimatedText>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-sm border-green-200 text-green-800 bg-green-50">
                  System Operational
                </Badge>
              </div>
            </div>
          </header>
        </SectionReveal>

        {/* Main Dashboard */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SectionReveal staggerChildren delay={0.1}>
            <MuttomDepotVisualization />
          </SectionReveal>
          <SectionReveal staggerChildren delay={0.2}>
            <AllTrainsVisualization />
          </SectionReveal>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}

function LiveKochiMetroMap() {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Kochi Metro Network
          </h3>
          <Badge variant="outline" className="text-xs border-green-200 text-green-800 bg-green-50">Live</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time network status - Route 1 Operational
        </p>
      </div>
      
      {/* Google Maps Embed */}
      <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <iframe 
          src="https://www.google.com/maps/d/u/0/embed?mid=1hDZ63MOP54MiTRW0G58XwhBQ1Nvz4tc&ehbc=2E312F"
          className="w-full h-80 lg:h-96"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Live Kochi Metro Route 1 Map"
        />
        
        {/* Overlay stats on the map */}
        <div className="absolute top-4 right-4 bg-gray-900 text-white rounded-lg p-3 shadow-lg">
          <div className="text-center">
            <p className="text-xs font-semibold text-green-400 mb-1">LIVE DATA</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="font-bold text-blue-400">25</p>
                <p className="text-gray-300">Trainsets</p>
              </div>
              <div>
                <p className="font-bold text-green-400">18</p>
                <p className="text-gray-300">Active</p>
              </div>
              <div>
                <p className="font-bold text-yellow-400">4</p>
                <p className="text-gray-300">Standby</p>
              </div>
              <div>
                <p className="font-bold text-red-400">3</p>
                <p className="text-gray-300">Maint.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Muttom Depot indicator */}
        <div className="absolute bottom-4 left-4 bg-yellow-500 text-black rounded-lg px-3 py-2 shadow-lg border border-yellow-400">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">DEPOT</span>
            <div>
              <p className="text-xs font-bold">MUTTOM DEPOT</p>
              <p className="text-xs">Smart Bay Management</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick stats below map */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-700">
          <p className="text-xs font-semibold text-green-700 dark:text-green-300">Route Length</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">25.6 km</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-700">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Stations</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">22</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center border border-purple-200 dark:border-purple-700">
          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Frequency</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">4 min</p>
        </div>
      </div>
    </div>
  );
}

function MuttomDepotVisualization() {
  const { revenueBay, iblBay, standbyBay, availableTrains } = useDashboard();
  
  // Generate all 25 trains to match Fleet Statistics calculations
  const generateAllTrains = () => {
    const allTrains: DashboardTrain[] = [];
    
    // Add existing trains from bays
    allTrains.push(...revenueBay, ...iblBay, ...standbyBay, ...availableTrains);
    
    // Generate remaining trains to make 25 total
    const existingCount = allTrains.length;
    const statuses = ['Service', 'Standby', 'IBL', 'Induct', 'Maintenance', 'Cleaning'] as const;
    
    for (let i = existingCount; i < 25; i++) {
      const trainNumber = String(i + 1).padStart(2, '0');
      allTrains.push({
        id: `K-${trainNumber}`,
        name: `Metro K-${trainNumber}`,
        status: statuses[i % statuses.length],
        position: { x: 0, y: 0, isDragging: false },
        energyLevel: Math.floor(Math.random() * 30) + 70, // 70-100%
        efficiency: Math.floor(Math.random() * 20) + 80 // 80-100%
      });
    }
    
    return allTrains.slice(0, 25); // Ensure exactly 25 trains
  };
  
  const allTrains = generateAllTrains();

  return (
    <Card className="w-full shadow-sm border-gray-200 dark:border-gray-700" data-testid="card-muttom-depot">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
          Metro Yukthi - Smart Bay Management System
        </CardTitle>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Intelligent Train Allocation for Kochi Metro Rail Limited
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Metro Network Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
            Kochi Metro Network
          </h2>
          <LiveKochiMetroMap />
        </div>

        {/* MUTTOM DEPOT OPERATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              MUTTOM DEPOT OPERATIONS
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Revenue Service Bay */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700 text-center">
                <div className="text-sm font-bold mb-2 text-green-700">REVENUE</div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">Revenue Service</h4>
                <p className="text-lg font-bold text-green-600">{allTrains.filter(t => t.status === 'Service').length}</p>
                <p className="text-xs text-green-700">Active Trains</p>
                {revenueBay.slice(0, 2).map(train => (
                  <div key={train.id} className="text-xs font-mono bg-green-100 dark:bg-green-800 rounded px-1 mt-1">
                    {train.id}
                  </div>
                ))}
              </div>
              
              {/* IBL Bay */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700 text-center">
                <div className="text-sm font-bold mb-2 text-yellow-700">MAINT</div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">IBL Maintenance</h4>
                <p className="text-lg font-bold text-yellow-600">{allTrains.filter(t => t.status === 'IBL').length}</p>
                <p className="text-xs text-yellow-700">In Service</p>
                {iblBay.slice(0, 2).map(train => (
                  <div key={train.id} className="text-xs font-mono bg-yellow-100 dark:bg-yellow-800 rounded px-1 mt-1">
                    {train.id}
                  </div>
                ))}
              </div>
              
              {/* Standby Bay */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700 text-center">
                <div className="text-sm font-bold mb-2 text-blue-700">STANDBY</div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm">Standby</h4>
                <p className="text-lg font-bold text-blue-600">{allTrains.filter(t => t.status === 'Standby').length}</p>
                <p className="text-xs text-blue-700">Ready</p>
                {standbyBay.slice(0, 2).map(train => (
                  <div key={train.id} className="text-xs font-mono bg-blue-100 dark:bg-blue-800 rounded px-1 mt-1">
                    {train.id}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LIVE SYSTEM STATUS */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              LIVE SYSTEM STATUS
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Trainsets</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">25</p>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-blue-600">{revenueBay.length + iblBay.length + standbyBay.length}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                  <p className="text-2xl font-bold text-gray-600">{availableTrains.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                  <p className="text-2xl font-bold text-green-600">96.8%</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Status Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-600">• Revenue Service</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{revenueBay.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">• Maintenance (IBL)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{iblBay.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">• Standby</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{standbyBay.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AllTrainsVisualization() {
  const { revenueBay, iblBay, standbyBay, availableTrains } = useDashboard();

  // Generate all 25 trains with realistic data
  const generateAllTrains = () => {
    const allTrains: DashboardTrain[] = [];
    
    // Add existing trains from bays
    allTrains.push(...revenueBay, ...iblBay, ...standbyBay, ...availableTrains);
    
    // Generate remaining trains to make 25 total
    const existingCount = allTrains.length;
    const statuses = ['Service', 'Standby', 'IBL', 'Induct', 'Maintenance', 'Cleaning'] as const;
    
    for (let i = existingCount; i < 25; i++) {
      const trainNumber = String(i + 1).padStart(2, '0');
      allTrains.push({
        id: `K-${trainNumber}`,
        name: `Metro K-${trainNumber}`,
        status: statuses[i % statuses.length],
        position: { x: 0, y: 0, isDragging: false },
        energyLevel: Math.floor(Math.random() * 30) + 70, // 70-100%
        efficiency: Math.floor(Math.random() * 20) + 80 // 80-100%
      });
    }
    
    return allTrains.slice(0, 25); // Ensure exactly 25 trains
  };

  const allTrains = generateAllTrains();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Service': return 'bg-green-50 text-green-800 border-green-200';
      case 'Standby': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'IBL': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Induct': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Maintenance': return 'bg-red-50 text-red-800 border-red-200';
      case 'Cleaning': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mt-8 w-full shadow-sm border-gray-200 dark:border-gray-700" data-testid="card-all-trains">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
          Complete Fleet Overview - 25 Trainsets
        </CardTitle>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Real-time status of all Kochi Metro trains with live data
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {allTrains.map((train, index) => {
            // Alternate between the two train images
            const trainImage = index % 2 === 0 ? yellowTrainImg : cyanTrainImg;
            const statusColor = getStatusColor(train.status);

            return (
              <div
                key={train.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                data-testid={`train-card-${train.id}`}
              >
                <div>
                  {/* Train Image */}
                  <div className="relative mb-4">
                    <img 
                      src={trainImage} 
                      alt={`Train ${train.id}`}
                      className="w-full h-16 object-contain"
                      data-testid={`train-image-${train.id}`}
                    />
                    
                    {/* Energy Level Badge */}
                    <div className="absolute top-0 right-0 bg-gray-900 text-white rounded-full px-2 py-1 text-xs font-semibold">
                      {train.energyLevel}%
                    </div>
                  </div>

                  {/* Train Info */}
                  <div className="space-y-3">
                    {/* Train ID & Name */}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white" data-testid={`train-id-${train.id}`}>
                        {train.id}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {train.name}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <span 
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${statusColor}`} 
                        data-testid={`train-status-${train.id}`}
                      >
                        {train.status}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center border border-green-200 dark:border-green-700">
                        <p className="text-xs font-medium text-green-700 dark:text-green-300">Energy</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">{train.energyLevel}%</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center border border-blue-200 dark:border-blue-700">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Efficiency</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{train.efficiency}%</p>
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="flex justify-center">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          train.status === 'Service' ? 'bg-green-500' :
                          train.status === 'Standby' ? 'bg-blue-500' :
                          train.status === 'IBL' ? 'bg-yellow-500' :
                          train.status === 'Maintenance' ? 'bg-red-500' : 'bg-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fleet Summary */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-white">
            Fleet Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Service', count: allTrains.filter(t => t.status === 'Service').length, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
              { label: 'Standby', count: allTrains.filter(t => t.status === 'Standby').length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
              { label: 'IBL', count: allTrains.filter(t => t.status === 'IBL').length, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
              { label: 'Induct', count: allTrains.filter(t => t.status === 'Induct').length, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
              { label: 'Maintenance', count: allTrains.filter(t => t.status === 'Maintenance').length, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
              { label: 'Cleaning', count: allTrains.filter(t => t.status === 'Cleaning').length, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' }
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-lg p-3 text-center border`}>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}