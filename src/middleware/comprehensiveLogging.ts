/**
 * Comprehensive logging system
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
  error?: Error;
}

export class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private minLevel: LogLevel = "info";

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Debug log
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, context);
  }

  /**
   * Info log
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context);
  }

  /**
   * Warning log
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context);
  }

  /**
   * Error log
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log("error", message, context, error);
  }

  /**
   * Log entry
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      error,
    };

    this.logs.push(entry);

    // Trim logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    this.outputToConsole(entry);
  }

  /**
   * Check if should log at level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.minLevel];
  }

  /**
   * Output to console
   */
  private outputToConsole(entry: LogEntry): void {
    const prefix = `[${new Date(entry.timestamp).toISOString()}] [${entry.level.toUpperCase()}]`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case "debug":
        console.debug(message, entry.context);
        break;
      case "info":
        console.info(message, entry.context);
        break;
      case "warn":
        console.warn(message, entry.context);
        break;
      case "error":
        console.error(message, entry.error, entry.context);
        break;
    }
  }

  /**
   * Get recent logs
   */
  getLogs(limit?: number): LogEntry[] {
    return limit ? this.logs.slice(-limit) : [...this.logs];
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }
}

export const logger = new Logger();

