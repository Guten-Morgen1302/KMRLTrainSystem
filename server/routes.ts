import { Request, Response, Router } from 'express';
import { storage } from './storage';
import { z } from 'zod';

const router = Router();

// Map data endpoints
router.get('/api/map', async (req: Request, res: Response) => {
  try {
    const mapData = await storage.getMapData();
    res.json(mapData);
  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).json({ error: 'Failed to fetch map data' });
  }
});

router.get('/api/stations', async (req: Request, res: Response) => {
  try {
    const stations = await storage.getStations();
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

router.get('/api/tracks', async (req: Request, res: Response) => {
  try {
    const tracks = await storage.getTrackSegments();
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching track segments:', error);
    res.status(500).json({ error: 'Failed to fetch track segments' });
  }
});

router.get('/api/platforms', async (req: Request, res: Response) => {
  try {
    const platforms = await storage.getPlatforms();
    res.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
});

router.get('/api/signals', async (req: Request, res: Response) => {
  try {
    const signals = await storage.getSignals();
    res.json(signals);
  } catch (error) {
    console.error('Error fetching signals:', error);
    res.status(500).json({ error: 'Failed to fetch signals' });
  }
});

// Train data endpoints
router.get('/api/trains', async (req: Request, res: Response) => {
  try {
    const trainData = await storage.getTrainData();
    res.json(trainData);
  } catch (error) {
    console.error('Error fetching train data:', error);
    res.status(500).json({ error: 'Failed to fetch train data' });
  }
});

router.get('/api/trains/list', async (req: Request, res: Response) => {
  try {
    const trains = await storage.getTrains();
    res.json(trains);
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).json({ error: 'Failed to fetch trains' });
  }
});

// Train update endpoints
const updatePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

router.patch('/api/trains/:trainId/position', async (req: Request, res: Response) => {
  try {
    const { trainId } = req.params;
    const result = updatePositionSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid position data', details: result.error });
    }

    const { x, y } = result.data;
    await storage.updateTrainPosition(trainId, x, y);
    res.json({ success: true, message: 'Position updated' });
  } catch (error) {
    console.error('Error updating train position:', error);
    res.status(500).json({ error: 'Failed to update train position' });
  }
});

const updateStatusSchema = z.object({
  status: z.enum(['Standby', 'IBL', 'Induct', 'Service', 'Cleaning', 'Maintenance']),
});

router.patch('/api/trains/:trainId/status', async (req: Request, res: Response) => {
  try {
    const { trainId } = req.params;
    const result = updateStatusSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid status data', details: result.error });
    }

    const { status } = result.data;
    await storage.updateTrainStatus(trainId, status);
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error updating train status:', error);
    res.status(500).json({ error: 'Failed to update train status' });
  }
});

// Health check endpoint
router.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Metro Yukthi API'
  });
});

export default router;