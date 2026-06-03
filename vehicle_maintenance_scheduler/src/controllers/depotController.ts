import { Request, Response } from 'express';
import { fetchDepots } from '../services/depotService';
import { logger } from '../utils/loggerWrapper';

/**
 * Controller to get all depots
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllDepots = async (req: Request, res: Response): Promise<void> => {
  try {
    const depots = await fetchDepots();
    logger.info('depotController.ts:0', 'Successfully retrieved depots');
    res.status(200).json(depots);
  } catch (error) {
    logger.error('depotController.ts:0', `Error retrieving depots: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve depots' });
  }
};

export default { getAllDepots };