import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip away properties not defined in DTOs
    transform: true, // Automatically transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
  }));

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Branch Buddy API')
    .setDescription('API documentation for the Branch Buddy School Management System')
    .setVersion('1.0')
    .addBearerAuth() // If using JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('APP_PORT') || 3001;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger API documentation available at: ${await app.getUrl()}/api-docs`);
}
bootstrap();
