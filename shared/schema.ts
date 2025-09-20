import { pgTable, text, integer, decimal, boolean, uuid, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Stations
export const stations = pgTable('stations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  x: decimal('x').notNull(),
  y: decimal('y').notNull(),
  isDepot: boolean('is_depot').default(false),
  isHighlighted: boolean('is_highlighted').default(false),
  lineColor: text('line_color').default('#000000'),
});

// Track segments for realistic railway layout
export const trackSegments = pgTable('track_segments', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // 'straight' | 'curve' | 'switch'
  fromStationId: text('from_station_id'),
  toStationId: text('to_station_id'),
  pathData: text('path_data').notNull(), // SVG path data
  isMainLine: boolean('is_main_line').default(true),
  trackNumber: integer('track_number').default(1),
});

// Platforms
export const platforms = pgTable('platforms', {
  id: text('id').primaryKey(),
  stationId: text('station_id').notNull(),
  name: text('name').notNull(),
  x: decimal('x').notNull(),
  y: decimal('y').notNull(),
  width: decimal('width').notNull(),
  height: decimal('height').notNull(),
  platformType: text('platform_type').notNull(), // 'passenger' | 'depot' | 'maintenance'
  capacity: integer('capacity').default(1),
});

// Signals and infrastructure
export const signals = pgTable('signals', {
  id: text('id').primaryKey(),
  x: decimal('x').notNull(),
  y: decimal('y').notNull(),
  type: text('type').notNull(), // 'main' | 'distant' | 'shunt'
  aspect: text('aspect').default('green'), // 'green' | 'yellow' | 'red'
  direction: text('direction').notNull(), // 'up' | 'down'
});

// Train cars (for realistic multi-car consists)
export const trainCars = pgTable('train_cars', {
  id: text('id').primaryKey(),
  trainId: text('train_id').notNull(),
  carNumber: integer('car_number').notNull(),
  carType: text('car_type').notNull(), // 'motor' | 'trailer' | 'driving_trailer'
  length: decimal('length').default('20'), // meters
  position: integer('position').notNull(), // position in consist (1, 2, 3...)
});

// Trains with realistic data
export const trains = pgTable('trains', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').notNull(), // 'Standby' | 'IBL' | 'Induct' | 'Service' | 'Cleaning'
  platformId: text('platform_id'),
  x: decimal('x').notNull(),
  y: decimal('y').notNull(),
  direction: text('direction').default('up'), // 'up' | 'down'
  speed: decimal('speed').default('0'),
  lastService: text('last_service'),
  mileage: text('mileage'),
  fitnessExpiry: text('fitness_expiry'),
  jobCardStatus: text('job_card_status'),
  consist: integer('consist').default(3), // number of cars
  operator: text('operator').default('Kochi Metro'),
  energyLevel: decimal('energy_level').default('100'),
});

// Infrastructure details for depot
export const depotInfrastructure = pgTable('depot_infrastructure', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'wash_plant' | 'maintenance_shed' | 'inspection_pit' | 'overhead_line'
  x: decimal('x').notNull(),
  y: decimal('y').notNull(),
  width: decimal('width'),
  height: decimal('height'),
  isActive: boolean('is_active').default(true),
});

// Create Zod schemas for validation
export const insertStationSchema = createInsertSchema(stations);
export const insertTrackSegmentSchema = createInsertSchema(trackSegments);
export const insertPlatformSchema = createInsertSchema(platforms);
export const insertSignalSchema = createInsertSchema(signals);
export const insertTrainCarSchema = createInsertSchema(trainCars);
export const insertTrainSchema = createInsertSchema(trains);
export const insertDepotInfrastructureSchema = createInsertSchema(depotInfrastructure);

// Enums for better type safety
export const TrainStatusEnum = z.enum(['Standby', 'IBL', 'Induct', 'Service', 'Cleaning', 'Maintenance']);
export const TrackTypeEnum = z.enum(['straight', 'curve', 'switch']);
export const PlatformTypeEnum = z.enum(['passenger', 'depot', 'maintenance', 'cleaning']);
export const SignalAspectEnum = z.enum(['green', 'yellow', 'red', 'off']);
export const DirectionEnum = z.enum(['up', 'down']);

// Type definitions
export type Station = typeof stations.$inferSelect;
export type TrackSegment = typeof trackSegments.$inferSelect;
export type Platform = typeof platforms.$inferSelect;
export type Signal = typeof signals.$inferSelect;
export type TrainCar = typeof trainCars.$inferSelect;
export type Train = typeof trains.$inferSelect;
export type DepotInfrastructure = typeof depotInfrastructure.$inferSelect;

export type InsertStation = z.infer<typeof insertStationSchema>;
export type InsertTrackSegment = z.infer<typeof insertTrackSegmentSchema>;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type InsertTrainCar = z.infer<typeof insertTrainCarSchema>;
export type InsertTrain = z.infer<typeof insertTrainSchema>;
export type InsertDepotInfrastructure = z.infer<typeof insertDepotInfrastructureSchema>;

// Combined map data interface
export interface MapData {
  stations: Station[];
  trackSegments: TrackSegment[];
  platforms: Platform[];
  signals: Signal[];
  depotInfrastructure: DepotInfrastructure[];
}

export interface TrainData {
  trains: Train[];
  trainCars: TrainCar[];
}

// Dashboard-specific schemas for interactive bay management
export const bays = pgTable('bays', {
  id: text('id').primaryKey(),
  index: integer('index').notNull(),
  type: text('type').notNull(), // 'INDUCT' | 'STANDBY' | 'IBL' | 'MAINTENANCE'
  capacity: integer('capacity').default(1),
  occupiedBy: text('occupied_by'), // train id
  status: text('status').default('available'), // 'available' | 'occupied' | 'maintenance' | 'disabled'
  x: decimal('x').notNull(),
  y: decimal('y').notNull(),
  efficiency: decimal('efficiency').default('100'),
});

export const scenarios = pgTable('scenarios', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // 'weather' | 'breakdown' | 'emergency' | 'vip' | 'power'
  severity: text('severity').default('medium'), // 'low' | 'medium' | 'high' | 'critical'
  effects: text('effects').notNull(), // JSON string of effects
  isActive: boolean('is_active').default(false),
});

export const insights = pgTable('insights', {
  id: text('id').primaryKey(),
  metric: text('metric').notNull(),
  value: decimal('value').notNull(),
  delta: decimal('delta').default('0'),
  unit: text('unit'),
  timestamp: timestamp('timestamp').defaultNow(),
  category: text('category').notNull(), // 'efficiency' | 'cost' | 'time' | 'safety'
});

export const achievements = pgTable('achievements', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'), // lucide icon name
  earned: boolean('earned').default(false),
  earnedAt: timestamp('earned_at'),
  points: integer('points').default(0),
  category: text('category').notNull(), // 'efficiency' | 'speed' | 'safety' | 'innovation'
});

// Enhanced position type for dashboard trains
export const DashboardPositionSchema = z.object({
  bay: z.number().optional(),
  x: z.number(),
  y: z.number(),
  isDragging: z.boolean().default(false),
});

export const DashboardTrainSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: TrainStatusEnum,
  position: DashboardPositionSchema,
  energyLevel: z.number().min(0).max(100),
  lastMaintenance: z.string().optional(),
  nextMaintenance: z.string().optional(),
  efficiency: z.number().min(0).max(100).default(100),
});

// Create Zod schemas for validation
export const insertBaySchema = createInsertSchema(bays);
export const insertScenarioSchema = createInsertSchema(scenarios);
export const insertInsightSchema = createInsertSchema(insights);
export const insertAchievementSchema = createInsertSchema(achievements);

// Enums for dashboard
export const BayTypeEnum = z.enum(['INDUCT', 'STANDBY', 'IBL', 'MAINTENANCE']);
export const BayStatusEnum = z.enum(['available', 'occupied', 'maintenance', 'disabled']);
export const ScenarioTypeEnum = z.enum(['weather', 'breakdown', 'emergency', 'vip', 'power']);
export const SeverityEnum = z.enum(['low', 'medium', 'high', 'critical']);
export const MetricCategoryEnum = z.enum(['efficiency', 'cost', 'time', 'safety']);
export const AchievementCategoryEnum = z.enum(['efficiency', 'speed', 'safety', 'innovation']);

// Type definitions for dashboard
export type Bay = typeof bays.$inferSelect;
export type Scenario = typeof scenarios.$inferSelect;
export type Insight = typeof insights.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type DashboardTrain = z.infer<typeof DashboardTrainSchema>;
export type DashboardPosition = z.infer<typeof DashboardPositionSchema>;

export type InsertBay = z.infer<typeof insertBaySchema>;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type InsertInsight = z.infer<typeof insertInsightSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

// Dashboard data interface
export interface DashboardData {
  trains: DashboardTrain[];
  bays: Bay[];
  scenarios: Scenario[];
  insights: Insight[];
  achievements: Achievement[];
}