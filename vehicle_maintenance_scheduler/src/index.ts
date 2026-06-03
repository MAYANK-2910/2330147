import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import depotRoutes from './routes/depotRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import healthRoutes from './routes/healthRoutes';
import { logger } from './utils/loggerWrapper';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/depots', depotRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/health', healthRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  logger.info('index.ts:0', 'Root endpoint accessed');
  res.send('Vehicle Maintenance Scheduler Microservice');
});

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn('index.ts:0', `Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: Function) => {
  logger.error('index.ts:0', `Internal server error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info('index.ts:0', `Server is running on port ${PORT}`);
});

export default app;