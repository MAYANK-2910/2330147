import { Request, Response } from 'express';
import { logger } from '../utils/loggerWrapper';

/**
 * Controller to get the health status of the service
 * @param req - Express request object
 * @param res - Express response object
 */
export const getHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('healthController.ts:0', 'Health check requested');
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error('healthController.ts:0', `Error in health check: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default { getHealth };