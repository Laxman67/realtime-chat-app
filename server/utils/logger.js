import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // capture stack trace
    logFormat
  ),
  transports: [
    // Console logs (colorized)
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),

    // All logs into file logs/combined  and errors
    new transports.File({
      filename: 'logs/combined.log',
    }),

    // Error logs only
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});

export default logger;
