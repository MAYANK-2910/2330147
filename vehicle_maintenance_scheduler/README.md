# Vehicle Maintenance Scheduler Microservice

A microservice that computes optimal vehicle maintenance schedules for depots using the 0/1 knapsack algorithm.

## Features

- Fetches depot and vehicle data from external evaluation service
- Implements 0/1 knapsack algorithm to maximize impact score within mechanic-hour constraints
- RESTful API endpoints for accessing depots, vehicles, schedules, and health status
- Integrated logging using reusable logging_middleware package
- Comprehensive error handling
- TypeScript with strict typing
- Production-ready structure

## API Endpoints

### GET `/api/depots`
Fetch all depots from the evaluation service.

**Response:**
```json
[
  {
    "id": "depot1",
    "capacity": 8,
    // ... other fields
  }
]
```

### GET `/api/vehicles`
Fetch all vehicles from the evaluation service.

**Response:**
```json
[
  {
    "id": "vehicle1",
    "weight": 2,    // duration
    "value": 10,    // impact
    // ... other fields
  }
]
```

### GET `/api/schedule`
Compute and return the optimal maintenance schedule for all depots.

**Response:**
```json
{
  "depots": [
    {
      "depotId": "depot1",
      "depotCapacity": 8,
      "selectedVehicles": [
        {
          "id": "vehicle1",
          "weight": 2,
          "value": 10
          // ... other fields
        }
      ],
      "totalDuration": 6,
      "totalImpact": 30
    }
  ],
  "summary": {
    "totalDepots": 2,
    "totalVehiclesConsidered": 5,
    "executionTimeMs": 15
  }
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript code:
   ```bash
   npm run build
   ```
4. Start the service:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Environment Variables

- `PORT`: Port on which the server runs (default: 3000)

## Dependencies

- express: Web framework
- axios: HTTP client for fetching data from evaluation service
- logging_middleware: Custom logging package (local dependency)

## Algorithm Details

The service solves a 0/1 knapsack problem for each depot:
- **Capacity**: Mechanic hours available at the depot
- **Items**: Vehicles requiring maintenance
- **Weight**: Duration of maintenance for each vehicle
- **Value**: Impact score of maintaining each vehicle

The algorithm uses dynamic programming with O(n*W) time complexity, where n is the number of vehicles and W is the depot capacity.

## Logging

All operations are logged using the logging_middleware package, which sends logs to the evaluation service at:
http://4.224.186.213/evaluation-service/logs

Logs include:
- Service startup
- API requests
- External API fetches
- Scheduler execution
- Errors

## Testing

Run unit tests with:
```bash
npm test
```

## License

MIT