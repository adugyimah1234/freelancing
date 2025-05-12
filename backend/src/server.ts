import app from './app';
import { AppDataSource } from './config/data-source';
import { logger } from './utils/logger';

const PORT = process.env.APP_PORT || 3001;

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Swagger API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to initialize data source or start server:', error);
    process.exit(1);
  }
};

startServer();
