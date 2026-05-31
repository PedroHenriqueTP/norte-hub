import pino from 'pino';

// Helper to get correlation ID from headers or store
// In Next.js App Router, we might use AsyncLocalStorage (via 'next/headers' or a wrapper)
// For simplicity, we define the logger instance here.

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    base: {
        env: process.env.NODE_ENV,
    },
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});

export const getLogger = (correlationId?: string) => {
    return logger.child({ correlationId });
};

export default logger;
