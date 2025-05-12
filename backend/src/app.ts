
import 'reflect-metadata';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { validate } from 'class-validator'; // For DTO validation middleware (example)
import { plainToInstance } from 'class-transformer'; // For DTO validation middleware (example)


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
        url: `http://localhost:${process.env.APP_PORT || 3001}/api`, // Base path for API routes
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
    security: [{ // Apply bearerAuth globally by default
      bearerAuth: []
    }]
  },
  apis: [
    './src/routes/**/*.ts', 
    './src/controllers/**/*.ts', 
    './src/entities/**/*.ts',
    './src/dto/**/*.ts' // Include DTOs for schema definitions
    ], 
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
// Serve Swagger docs at /api-docs, not under /api prefix
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes - Prefixed with /api
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
  // This structure assumes errors are an array of ValidationError-like objects
  if ((err as any).errors && Array.isArray((err as any).errors)) {
    const messages = (err as any).errors.map((e: any) => Object.values(e.constraints || {})).flat();
    return res.status(400).json({
        status: 'fail',
        message: messages.join(', ') || 'Validation error',
        errors: (err as any).errors // Optionally include detailed errors in dev
    });
  }
  
  // Handle generic validation errors if class-validator is used with `app.useGlobalPipes(new ValidationPipe())` in NestJS style
  // For Express, manual validation or a middleware is needed.
  // If err has a 'status' and 'message' property from a validation pipe like in NestJS:
  if ((err as any).status && (err as any).status === 400 && (err asany).message) {
     return res.status(400).json({
        status: 'fail',
        message: (err as any).message, // This might be an array of messages or a string
        errors: (err as any).response?.message || (err as any).message // More detailed errors if available
    });
  }


  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went very wrong!',
  });
});

// Handle 404 Not Found for /api routes specifically
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Catch-all for non-API routes (if frontend is served separately or for general 404s)
app.use('*', (req: Request, res: Response) => {
  // If you have a client-side router, you might want to send index.html here
  // For now, just send a 404 for any other unhandled route.
  if (!res.headersSent) { // Check if response has already been sent by API 404 handler
    res.status(404).json({
      status: 'fail',
      message: `Resource ${req.originalUrl} not found on this server.`,
    });
  }
});


export default app;
