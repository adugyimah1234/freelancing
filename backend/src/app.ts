import 'reflect-metadata';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import mainRouter from './routes';
import { AppError } from './utils/app-error';
import { logger } from './utils/logger';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Branch Buddy API',
      version: '1.0.0',
      description: 'API documentation for the Branch Buddy School Management System (Node.js/Express)',
    },
    servers: [
      {
        url: `http://localhost:${process.env.APP_PORT || 3001}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts', './src/entities/**/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api', mainRouter);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // For class-validator errors (or other libraries that might add a 'errors' property)
  if ((err as any).errors && Array.isArray((err as any).errors)) {
    const messages = (err as any).errors.map((e: any) => Object.values(e.constraints || {})).flat();
    return res.status(400).json({
        status: 'fail',
        message: messages.join(', ') || 'Validation error',
    });
  }

  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went very wrong!',
  });
});

// Handle 404 Not Found
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default app;
