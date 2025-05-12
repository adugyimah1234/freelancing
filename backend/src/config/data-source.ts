
import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { environment } from './environment';
import path from 'path';

// Import all entities
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { Branch } from '../entities/branch.entity';
import { Student } from '../entities/student.entity';
import { Parent } from '../entities/parent.entity';
import { AcademicClass } from '../entities/academic-class.entity';
import { FeeCategory } from '../entities/fee-category.entity';
import { FeeStructure } from '../entities/fee-structure.entity';
import { FeePayment } from '../entities/fee-payment.entity';
import { Receipt } from '../entities/receipt.entity';
import { Exam } from '../entities/exam.entity';


export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: environment.dbHost,
  port: environment.dbPort,
  username: environment.dbUsername,
  password: environment.dbPassword,
  database: environment.dbDatabase,
  synchronize: environment.nodeEnv === 'development', // Set to false in production, use migrations
  logging: environment.nodeEnv === 'development' ? ['query', 'error'] : ['error'],
  entities: [
    User,
    Role,
    Permission,
    Branch,
    Student,
    Parent,
    AcademicClass,
    FeeCategory,
    FeeStructure,
    FeePayment,
    Receipt,
    Exam,
    // path.join(__dirname, '../entities/**/*.entity.{ts,js}') // Keep this if you prefer glob pattern
  ],
  migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{ts,js}')],
  migrationsTableName: 'migrations',
};

export const AppDataSource = new DataSource(dataSourceOptions);
