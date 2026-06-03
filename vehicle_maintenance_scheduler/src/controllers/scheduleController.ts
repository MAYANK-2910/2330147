import { Request, Response } from 'express';
import { computeSchedule } from '../services/scheduleService';
import { logger } from '../utils/loggerWrapper';

/**
 * Controller to get the maintenance schedule for all depots
 * @param req - Express request object
 * @param res - Express response object
 */
export const getSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await computeSchedule();
    logger.info('scheduleController.ts:0', 'Successfully computed schedule');
    res.status(200).json(result);
  } catch (error) {
    logger.error('scheduleController.ts:0', `Error computing schedule: ${error.message}`);
    res.status(500).json({ error: 'Failed to compute schedule' });
  }
};

export default { getSchedule };