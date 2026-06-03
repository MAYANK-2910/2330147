# Logging Middleware

A reusable logging middleware for TypeScript/Node.js applications that sends logs to a remote evaluation service.

## Features

- Structured logging with stack, level, package name, and message
- Input validation for all log fields
- Automatic retry mechanism with exponential backoff
- Support for all standard log levels (info, debug, warn, error, fatal)
- Easy to use Logger class with static methods
- Unit test friendly design
- Zero dependencies besides axios

## Installation

```bash
npm install ./path/to/logging_middleware
```

Or if published to npm:

```bash
npm install logging_middleware
```

## Usage

### Basic Usage

```typescript
import { Logger } from 'logging_middleware';

// Initialize logger for your package
const logger = Logger.getInstance('my-service');

// Log messages at different levels
await logger.info('app.js:10', 'Application started');
await logger.debug('utils.js:42', 'Processing data');
await logger.warn('middleware.js:15', 'Request took longer than expected');
await logger.error('controller.js:23', 'Failed to process request');
await logger.fatal('index.js:5', 'Critical error, shutting down');
```

### With Custom Endpoint

```typescript
import { Logger } from 'logging_middleware';

const logger = Logger.getInstance('my-service', 'https://my-logging-service.com/logs');
await logger.info('app.js:10', 'Application started');
```

## API

### Logger.getInstance(packageName: string, endpoint?: string): Logger
- **packageName**: Name of your service/package
- **endpoint** (optional): Custom endpoint for logs (default: http://4.224.186.213/evaluation-service/logs)
- Returns: Singleton Logger instance

### Logger Methods
All methods are asynchronous and return a Promise.

- `info(stack: string, message: string): Promise<void>`
- `debug(stack: string, message: string): Promise<void>`
- `warn(stack: string, message: string): Promise<void>`
- `error(stack: string, message: string): Promise<void>`
- `fatal(stack: string, message: string): Promise<void>`

Each method takes:
- **stack**: Stack trace or origin of the log (e.g., 'file.js:lineNumber')
- **message**: Log message to be recorded

## Error Handling

The Logger handles API failures gracefully with:
- Automatic retries (3 attempts by default)
- Exponential backoff between retries
- Throwing an error only after all retries are exhausted

## Testing

The Logger is designed to be unit-test friendly. You can mock the axios dependency to test logging behavior without making actual HTTP requests.

## License

MIT