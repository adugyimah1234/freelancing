import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeOrmAsyncConfig } from './config/typeorm.config'; // Will be created later

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: '.env', // Specify the .env file path
    }),
    // TypeOrmModule.forRootAsync(typeOrmAsyncConfig), // TypeORM setup will be added later
    // UserModule, // Example module, will be added later
    // AuthModule, // Example module, will be added later
    // Other modules...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
