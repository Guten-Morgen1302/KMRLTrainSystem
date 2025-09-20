import { 
  Station, TrackSegment, Platform, Signal, Train, TrainCar, DepotInfrastructure,
  MapData, TrainData 
} from '@shared/schema';

export interface IStorage {
  // Map data operations
  getMapData(): Promise<MapData>;
  getStations(): Promise<Station[]>;
  getTrackSegments(): Promise<TrackSegment[]>;
  getPlatforms(): Promise<Platform[]>;
  getSignals(): Promise<Signal[]>;
  getDepotInfrastructure(): Promise<DepotInfrastructure[]>;
  
  // Train operations
  getTrainData(): Promise<TrainData>;
  getTrains(): Promise<Train[]>;
  getTrainCars(): Promise<TrainCar[]>;
  updateTrainPosition(trainId: string, x: number, y: number): Promise<void>;
  updateTrainStatus(trainId: string, status: string): Promise<void>;
}

export class MemoryStorage implements IStorage {
  private stations: Station[] = [];
  private trackSegments: TrackSegment[] = [];
  private platforms: Platform[] = [];
  private signals: Signal[] = [];
  private trains: Train[] = [];
  private trainCars: TrainCar[] = [];
  private depotInfrastructure: DepotInfrastructure[] = [];

  constructor() {
    this.initializeRealisticData();
  }

  async getMapData(): Promise<MapData> {
    return {
      stations: this.stations,
      trackSegments: this.trackSegments,
      platforms: this.platforms,
      signals: this.signals,
      depotInfrastructure: this.depotInfrastructure,
    };
  }

  async getStations(): Promise<Station[]> {
    return [...this.stations];
  }

  async getTrackSegments(): Promise<TrackSegment[]> {
    return [...this.trackSegments];
  }

  async getPlatforms(): Promise<Platform[]> {
    return [...this.platforms];
  }

  async getSignals(): Promise<Signal[]> {
    return [...this.signals];
  }

  async getDepotInfrastructure(): Promise<DepotInfrastructure[]> {
    return [...this.depotInfrastructure];
  }

  async getTrainData(): Promise<TrainData> {
    return {
      trains: this.trains,
      trainCars: this.trainCars,
    };
  }

  async getTrains(): Promise<Train[]> {
    return [...this.trains];
  }

  async getTrainCars(): Promise<TrainCar[]> {
    return [...this.trainCars];
  }

  async updateTrainPosition(trainId: string, x: number, y: number): Promise<void> {
    const train = this.trains.find(t => t.id === trainId);
    if (train) {
      train.x = x.toString();
      train.y = y.toString();
    }
  }

  async updateTrainStatus(trainId: string, status: string): Promise<void> {
    const train = this.trains.find(t => t.id === trainId);
    if (train) {
      train.status = status;
    }
  }

  private initializeRealisticData() {
    // Real Kochi Metro Line stations with accurate positions
    this.stations = [
      { id: 'aluva', name: 'Aluva', code: 'ALVA', x: '100', y: '300', isDepot: false, isHighlighted: false, lineColor: '#0066cc' },
      { id: 'pulinchodu', name: 'Pulinchodu', code: 'PLCD', x: '180', y: '300', isDepot: false, isHighlighted: false, lineColor: '#0066cc' },
      { id: 'companypady', name: 'Companypady', code: 'CMPD', x: '260', y: '300', isDepot: false, isHighlighted: false, lineColor: '#0066cc' },
      { id: 'ambattukavu', name: 'Ambattukavu', code: 'AMBT', x: '340', y: '300', isDepot: false, isHighlighted: false, lineColor: '#0066cc' },
      { id: 'muttom', name: 'Muttom', code: 'MTTM', x: '420', y: '300', isDepot: true, isHighlighted: true, lineColor: '#0066cc' },
      { id: 'kalamassery', name: 'Kalamassery', code: 'KLMS', x: '500', y: '300', isDepot: false, isHighlighted: false, lineColor: '#0066cc' },
      { id: 'cusat', name: 'CUSAT', code: 'CUST', x: '580', y: '300', isDepot: false, isHighlighted: false, lineColor: '#0066cc' },
      { id: 'pathadipalam', name: 'Pathadipalam', code: 'PTDP', x: '660', y: '300', isDepot: false, isHighlighted: false, lineColor: '#0066cc' },
      { id: 'edapally', name: 'Edapally', code: 'EDPL', x: '740', y: '300', isDepot: false, isHighlighted: false, lineColor: '#0066cc' },
    ];

    // Realistic track segments with curves and switches
    this.trackSegments = [
      // Main line segments
      { id: 'track-aluva-pulinchodu', type: 'straight', fromStationId: 'aluva', toStationId: 'pulinchodu', pathData: 'M 100 300 L 180 300', isMainLine: true, trackNumber: 1 },
      { id: 'track-pulinchodu-companypady', type: 'straight', fromStationId: 'pulinchodu', toStationId: 'companypady', pathData: 'M 180 300 L 260 300', isMainLine: true, trackNumber: 1 },
      { id: 'track-companypady-ambattukavu', type: 'curve', fromStationId: 'companypady', toStationId: 'ambattukavu', pathData: 'M 260 300 Q 300 295 340 300', isMainLine: true, trackNumber: 1 },
      { id: 'track-ambattukavu-muttom', type: 'straight', fromStationId: 'ambattukavu', toStationId: 'muttom', pathData: 'M 340 300 L 420 300', isMainLine: true, trackNumber: 1 },
      
      // Muttom depot tracks (fan-out design)
      { id: 'depot-lead-1', type: 'switch', fromStationId: 'muttom', toStationId: null, pathData: 'M 420 300 Q 440 290 460 280', isMainLine: false, trackNumber: 2 },
      { id: 'depot-lead-2', type: 'switch', fromStationId: 'muttom', toStationId: null, pathData: 'M 420 300 Q 440 310 460 320', isMainLine: false, trackNumber: 3 },
      { id: 'depot-lead-3', type: 'switch', fromStationId: 'muttom', toStationId: null, pathData: 'M 420 300 Q 440 330 460 360', isMainLine: false, trackNumber: 4 },
      { id: 'depot-track-1', type: 'straight', fromStationId: null, toStationId: null, pathData: 'M 460 280 L 560 280', isMainLine: false, trackNumber: 2 },
      { id: 'depot-track-2', type: 'straight', fromStationId: null, toStationId: null, pathData: 'M 460 320 L 560 320', isMainLine: false, trackNumber: 3 },
      { id: 'depot-track-3', type: 'straight', fromStationId: null, toStationId: null, pathData: 'M 460 360 L 560 360', isMainLine: false, trackNumber: 4 },
      
      // Continue main line
      { id: 'track-muttom-kalamassery', type: 'straight', fromStationId: 'muttom', toStationId: 'kalamassery', pathData: 'M 420 300 L 500 300', isMainLine: true, trackNumber: 1 },
      { id: 'track-kalamassery-cusat', type: 'curve', fromStationId: 'kalamassery', toStationId: 'cusat', pathData: 'M 500 300 Q 540 305 580 300', isMainLine: true, trackNumber: 1 },
      { id: 'track-cusat-pathadipalam', type: 'straight', fromStationId: 'cusat', toStationId: 'pathadipalam', pathData: 'M 580 300 L 660 300', isMainLine: true, trackNumber: 1 },
      { id: 'track-pathadipalam-edapally', type: 'straight', fromStationId: 'pathadipalam', toStationId: 'edapally', pathData: 'M 660 300 L 740 300', isMainLine: true, trackNumber: 1 },
    ];

    // Detailed platforms at Muttom depot
    this.platforms = [
      // Main station platforms
      { id: 'muttom-up', stationId: 'muttom', name: 'Platform 1 (Up)', x: '410', y: '285', width: '80', height: '10', platformType: 'passenger', capacity: 1 },
      { id: 'muttom-down', stationId: 'muttom', name: 'Platform 2 (Down)', x: '410', y: '305', width: '80', height: '10', platformType: 'passenger', capacity: 1 },
      
      // Depot stabling roads
      { id: 'depot-road-1', stationId: 'muttom', name: 'Depot Road 1', x: '460', y: '275', width: '100', height: '10', platformType: 'depot', capacity: 2 },
      { id: 'depot-road-2', stationId: 'muttom', name: 'Depot Road 2', x: '460', y: '315', width: '100', height: '10', platformType: 'depot', capacity: 2 },
      { id: 'depot-road-3', stationId: 'muttom', name: 'Depot Road 3', x: '460', y: '355', width: '100', height: '10', platformType: 'depot', capacity: 2 },
      
      // Maintenance facilities
      { id: 'ibl-bay', stationId: 'muttom', name: 'IBL Bay', x: '570', y: '275', width: '60', height: '15', platformType: 'maintenance', capacity: 1 },
      { id: 'cleaning-bay', stationId: 'muttom', name: 'Cleaning Bay', x: '570', y: '300', width: '60', height: '15', platformType: 'depot', capacity: 1 },
      { id: 'inspection-pit', stationId: 'muttom', name: 'Inspection Pit', x: '570', y: '325', width: '60', height: '15', platformType: 'maintenance', capacity: 1 },
    ];

    // Realistic signals
    this.signals = [
      { id: 'sig-muttom-up', x: '400', y: '295', type: 'main', aspect: 'green', direction: 'up' },
      { id: 'sig-muttom-down', x: '440', y: '305', type: 'main', aspect: 'yellow', direction: 'down' },
      { id: 'sig-depot-entry', x: '450', y: '290', type: 'shunt', aspect: 'green', direction: 'up' },
      { id: 'sig-depot-exit', x: '550', y: '290', type: 'shunt', aspect: 'red', direction: 'down' },
    ];

    // Depot infrastructure
    this.depotInfrastructure = [
      { id: 'wash-plant', name: 'Train Wash Plant', type: 'wash_plant', x: '580', y: '340', width: '40', height: '20', isActive: true },
      { id: 'maintenance-shed', name: 'Maintenance Shed', type: 'maintenance_shed', x: '620', y: '270', width: '50', height: '30', isActive: true },
      { id: 'overhead-lines-1', name: 'OHE Section A', type: 'overhead_line', x: '460', y: '270', width: '100', height: '5', isActive: true },
      { id: 'overhead-lines-2', name: 'OHE Section B', type: 'overhead_line', x: '460', y: '310', width: '100', height: '5', isActive: true },
      { id: 'control-room', name: 'Depot Control Room', type: 'maintenance_shed', x: '640', y: '320', width: '30', height: '20', isActive: true },
    ];

    // Multiple realistic trains with 3-car consists
    this.trains = [
      {
        id: 'DMU-001', name: 'DMU-001', status: 'Standby', platformId: 'muttom-up',
        x: '415', y: '287', direction: 'up', speed: '0',
        lastService: '2024-09-11', mileage: '45,230 km', fitnessExpiry: '2025-03-15', jobCardStatus: 'Cleared',
        consist: 3, operator: 'Kochi Metro', energyLevel: '95.5'
      },
      {
        id: 'DMU-002', name: 'DMU-002', status: 'Induct', platformId: 'depot-road-1',
        x: '465', y: '277', direction: 'up', speed: '0',
        lastService: '2024-09-10', mileage: '38,450 km', fitnessExpiry: '2025-01-20', jobCardStatus: 'Minor Work',
        consist: 3, operator: 'Kochi Metro', energyLevel: '88.2'
      },
      {
        id: 'DMU-003', name: 'DMU-003', status: 'IBL', platformId: 'ibl-bay',
        x: '575', y: '277', direction: 'down', speed: '0',
        lastService: '2024-09-08', mileage: '52,100 km', fitnessExpiry: '2024-12-05', jobCardStatus: 'Major Service',
        consist: 3, operator: 'Kochi Metro', energyLevel: '15.0'
      },
      {
        id: 'DMU-004', name: 'DMU-004', status: 'Cleaning', platformId: 'cleaning-bay',
        x: '575', y: '302', direction: 'down', speed: '0',
        lastService: '2024-09-11', mileage: '41,870 km', fitnessExpiry: '2025-02-10', jobCardStatus: 'Cleaning Schedule',
        consist: 3, operator: 'Kochi Metro', energyLevel: '92.1'
      },
      {
        id: 'DMU-005', name: 'DMU-005', status: 'Service', platformId: 'muttom-down',
        x: '415', y: '307', direction: 'down', speed: '0',
        lastService: '2024-09-12', mileage: '29,560 km', fitnessExpiry: '2025-06-30', jobCardStatus: 'Ready for Service',
        consist: 3, operator: 'Kochi Metro', energyLevel: '100.0'
      },
      {
        id: 'DMU-006', name: 'DMU-006', status: 'Standby', platformId: 'depot-road-2',
        x: '465', y: '317', direction: 'up', speed: '0',
        lastService: '2024-09-09', mileage: '47,320 km', fitnessExpiry: '2025-04-15', jobCardStatus: 'Inspection Due',
        consist: 3, operator: 'Kochi Metro', energyLevel: '76.8'
      },
      {
        id: 'DMU-007', name: 'DMU-007', status: 'Maintenance', platformId: 'inspection-pit',
        x: '575', y: '327', direction: 'up', speed: '0',
        lastService: '2024-09-05', mileage: '55,890 km', fitnessExpiry: '2024-11-20', jobCardStatus: 'Preventive Maintenance',
        consist: 3, operator: 'Kochi Metro', energyLevel: '0.0'
      },
      {
        id: 'DMU-008', name: 'DMU-008', status: 'Standby', platformId: 'depot-road-3',
        x: '465', y: '357', direction: 'down', speed: '0',
        lastService: '2024-09-12', mileage: '33,210 km', fitnessExpiry: '2025-08-10', jobCardStatus: 'Ready',
        consist: 3, operator: 'Kochi Metro', energyLevel: '98.5'
      }
    ];

    // Generate train cars for each train (3-car consists)
    this.trains.forEach(train => {
      const consistLength = train.consist || 3;
      for (let i = 1; i <= consistLength; i++) {
        this.trainCars.push({
          id: `${train.id}-CAR-${i}`,
          trainId: train.id,
          carNumber: i,
          carType: i === 1 || i === 3 ? 'driving_trailer' : 'motor',
          length: '20',
          position: i
        });
      }
    });
  }
}

// Export singleton instance
export const storage = new MemoryStorage();