import { Request, Response } from 'express';
import { fetchVehicles } from '../services/vehicleService';
import { logger } from '../utils/loggerWrapper';

/**
 * Controller to get all vehicles
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await fetchVehicles();
    logger.info('vehicleController.ts:0', 'Successfully retrieved vehicles');
    res.status(200).json(vehicles);
  } catch (error) {
    logger.error('vehicleController.ts:0', `Error retrieving vehicles: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve vehicles' });
  }
};

export default { getAllVehicles };