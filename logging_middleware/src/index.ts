import axios from 'axios';

/**
 * Log entry structure
 */
export interface LogEntry {
  stack: string;
  level: string;
  packageName: string;
  message: string;
}

/**
 * Valid log levels
 */
export const VALID_LEVELS = ['info', 'debug', 'warn', 'error', 'fatal'] as const;
export type LogLevel = typeof VALID_LEVELS[number];

/**
 * Logger class providing static methods for logging
 */
export class Logger {
  private static instance: Logger;
  private readonly packageName: string;
  private readonly endpoint: string;

  private constructor(packageName: string, endpoint: string = 'http://4.224.186.213/evaluation-service/logs') {
    this.packageName = packageName;
    this.endpoint = endpoint;
  }

  /**
   * Get singleton instance of Logger
   * @param packageName - Name of the package/service using the logger
   * @param endpoint - Optional custom endpoint for logs
   * @returns Logger instance
   */
  public static getInstance(packageName: string, endpoint?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(packageName, endpoint);
    }
    return Logger.instance;
  }

  /**
   * Validate log entry fields
   * @param stack - Stack trace or origin
   * @param level - Log level
   * @param packageName - Package name
   * @param message - Log message
   * @throws Error if validation fails
   */
  private validateLogEntry(stack: string, level: string, packageName: string, message: string): void {
    if (!stack || typeof stack !== 'string') {
      throw new Error('Stack must be a non-empty string');
    }
    if (!level || typeof level !== 'string' || !VALID_LEVELS.includes(level as LogLevel)) {
      throw new Error(`Level must be one of ${VALID_LEVELS.join(', ')}`);
    }
    if (!packageName || typeof packageName !== 'string') {
      throw new Error('Package name must be a non-empty string');
    }
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string');
    }
  }

  /**
   * Send log to external service with retry mechanism
   * @param logEntry - Log entry to send
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   * @param delayMs - Delay between retries in milliseconds (default: 1000)
   * @returns Promise resolving when log is sent or exhausting retries
   */
  private async sendLogWithRetry(
    logEntry: LogEntry,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await axios.post(this.endpoint, logEntry, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        });
        return; // Success
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt < maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
        }
      }
    }

    // If we get here, all retries failed
    throw new Error(`Failed to send log after ${maxRetries + 1} attempts: ${lastError?.message}`);
  }

  /**
   * Log info level message
   * @param stack - Stack trace or origin
   * @param message - Log message
   */
  public async info(stack: string, message: string): Promise<void> {
    await this.log(stack, 'info', message);
  }

  /**
   * Log debug level message
   * @param stack - Stack trace or origin
   * @param message - Log message
   */
  public async debug(stack: string, message: string): Promise<void> {
    await this.log(stack, 'debug', message);
  }

  /**
   * Log warn level message
   * @param stack - Stack trace or origin
   * @param message - Log message
   */
  public async warn(stack: string, message: string): Promise<void> {
    await this.log(stack, 'warn', message);
  }

  /**
   * Log error level message
   * @param stack - Stack trace or origin
   * @param message - Log message
   */
  public async error(stack: string, message: string): Promise<void> {
    await this.log(stack, 'error', message);
  }

  /**
   * Log fatal level message
   * @param stack - Stack trace or origin
   * @param message - Log message
   */
  public async fatal(stack: string, message: string): Promise<void> {
    await this.log(stack, 'fatal', message);
  }

  /**
   * Internal method to create and send log entry
   * @param stack - Stack trace or origin
   * @param level - Log level
   * @param message - Log message
   */
  private async log(stack: string, level: string, message: string): Promise<void> {
    this.validateLogEntry(stack, level, this.packageName, message);
    const logEntry: LogEntry = {
      stack,
      level,
      packageName: this.packageName,
      message
    };
    await this.sendLogWithRetry(logEntry);
  }
}

// Export the Logger class and types
export { Logger };
export type { LogEntry, LogLevel };