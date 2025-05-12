import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { environment } from './environment';
import path from 'path';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: environment.dbHost,
  port: environment.dbPort,
  username: environment.dbUsername,
  password: environment.dbPassword,
  database: environment.dbDatabase,
  synchronize: environment.nodeEnv === 'development', // Set to false in production, use migrations
  logging: environment.nodeEnv === 'development' ? ['query', 'error'] : ['error'],
  entities: [path.join(__dirname, '../entities/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{ts,js}')],
  migrationsTableName: 'migrations',
};

export const AppDataSource = new DataSource(dataSourceOptions);
