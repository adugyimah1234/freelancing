// A simple logger utility. In a production app, you might use a more robust library like Winston or Pino.
const getTimestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, ...optionalParams: any[]) => {
    console.log(`[INFO] ${getTimestamp()} - ${message}`, ...optionalParams);
  },
  warn: (message: string, ...optionalParams: any[]) => {
    console.warn(`[WARN] ${getTimestamp()} - ${message}`, ...optionalParams);
  },
  error: (message: string, ...optionalParams: any[]) => {
    console.error(`[ERROR] ${getTimestamp()} - ${message}`, ...optionalParams);
  },
  debug: (message: string, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${getTimestamp()} - ${message}`, ...optionalParams);
    }
  },
};
