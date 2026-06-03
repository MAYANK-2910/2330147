import { logger } from '../utils/loggerWrapper';
import { fetchDepots } from './depotService';
import { fetchVehicles } from './vehicleService';

/**
 * Interface for the result of the knapsack algorithm
 */
export interface KnapsackResult {
  selectedVehicles: any[]; // Array of selected vehicle objects
  totalDuration: number;   // Sum of weights of selected vehicles
  totalImpact: number;     // Sum of values of selected vehicles
  executionTimeMs: number; // Time taken to compute the knapsack
  depotsCount: number;     // Number of depots processed
  vehiclesConsidered: number; // Number of vehicles considered
}

/**
 * Solves the 0/1 knapsack problem for a single depot.
 * @param capacity - Maximum weight (mechanic hours) for the depot
 * @param vehicles - Array of vehicles, each with weight (duration) and value (impact)
 * @returns Object containing selected vehicles, total duration, and total impact
 */
const knapsack01 = (capacity: number, vehicles: any[]): any => {
  const n = vehicles.length;
  // DP table: dp[i][w] = maximum value achievable with first i vehicles and weight limit w
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  // Build table dp[][] in bottom up manner
  for (let i = 1; i <= n; i++) {
    const weight = vehicles[i - 1].weight;
    const value = vehicles[i - 1].value;
    for (let w = 0; w <= capacity; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(value + dp[i - 1][w - weight], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // To find which vehicles are included, we backtrack through the dp table
  const selectedIndices: number[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedIndices.push(i - 1); // index in vehicles array
      w -= vehicles[i - 1].weight;
    }
  }

  const selectedVehicles = selectedIndices.map(index => vehicles[index]);
  const totalDuration = selectedVehicles.reduce((sum, vehicle) => sum + (vehicle.weight || 0), 0);
  const totalImpact = selectedVehicles.reduce((sum, vehicle) => sum + (vehicle.value || 0), 0);

  return {
    selectedVehicles,
    totalDuration,
    totalImpact
  };
};

/**
 * Computes the optimal maintenance schedule for all depots.
 * For each depot, we solve a knapsack problem where:
 *   - capacity = depot.capacity (mechanic hours)
 *   - each vehicle has weight = vehicle.weight (duration) and value = vehicle.value (impact)
 * We assume the same set of vehicles is available for each depot (as per problem statement).
 *
 * @returns Promise resolving to an array of results, one per depot
 */
export const computeSchedule = async (): Promise<any[]> => {
  const startTime = Date.now();
  try {
    logger.info('scheduleService.ts:0', 'Starting schedule computation');
    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    logger.info('scheduleService.ts:0', `Fetched ${depots.length} depots and ${vehicles.length} vehicles`);

    const results = [];

    for (const depot of depots) {
      const capacity = depot.capacity;
      // We create a copy of vehicles array because we are going to use it for each depot
      // Note: The problem does not specify that vehicles are unique per depot, so we use the same list.
      const depotResult = knapsack01(capacity, vehicles);

      results.push({
        depotId: depot.id,
        depotCapacity: capacity,
        selectedVehicles: depotResult.selectedVehicles,
        totalDuration: depotResult.totalDuration,
        totalImpact: depotResult.totalImpact
      });
    }

    const endTime = Date.now();
    const executionTimeMs = endTime - startTime;

    logger.info('scheduleService.ts:0', `Schedule computation completed in ${executionTimeMs}ms`);

    // We also return summary statistics
    return {
      depots: results,
      summary: {
        totalDepots: depots.length,
        totalVehiclesConsidered: vehicles.length,
        executionTimeMs
      }
    };
  } catch (error) {
    logger.error('scheduleService.ts:0', `Error computing schedule: ${error.message}`);
    throw new Error(`Failed to compute schedule: ${error.message}`);
  }
};