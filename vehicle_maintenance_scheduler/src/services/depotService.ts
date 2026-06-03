import axios from 'axios';
import { logger } from '../utils/loggerWrapper';

const EVALUATION_SERVICE_BASE_URL = 'http://4.224.186.213/evaluation-service';

export interface Depot {
  id: string;
  capacity: number; // mechanic hours
  [key: string]: any; // for any other fields
}

/**
 * Fetch all depots from the evaluation service
 */
export const fetchDepots = async (): Promise<Depot[]> => {
  try {
    logger.info('depotService.ts:0', 'Fetching depots from evaluation service');
    const response = await axios.get(`${EVALUATION_SERVICE_BASE_URL}/depots`);
    logger.info('depotService.ts:0', `Successfully fetched ${response.data.length} depots`);
    return response.data;
  } catch (error) {
    logger.error('depotService.ts:0', `Failed to fetch depots: ${error.message}`);
    throw new Error(`Failed to fetch depots: ${error.message}`);
  }
};