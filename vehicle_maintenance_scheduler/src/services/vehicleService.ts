import axios from 'axios';
import { logger } from '../utils/loggerWrapper';

const EVALUATION_SERVICE_BASE_URL = 'http://4.224.186.213/evaluation-service';

export interface Vehicle {
  id: string;
  weight: number; // vehicle duration
  value: number; // vehicle impact
  [key: string]: any; // for any other fields
}

/**
 * Fetch all vehicles from the evaluation service
 */
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    logger.info('vehicleService.ts:0', 'Fetching vehicles from evaluation service');
    const response = await axios.get(`${EVALUATION_SERVICE_BASE_URL}/vehicles`);
    logger.info('vehicleService.ts:0', `Successfully fetched ${response.data.length} vehicles`);
    return response.data;
  } catch (error) {
    logger.error('vehicleService.ts:0', `Failed to fetch vehicles: ${error.message}`);
    throw new Error(`Failed to fetch vehicles: ${error.message}`);
  }
};