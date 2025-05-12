
import dotenv from 'dotenv';

dotenv.config();

export const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.APP_PORT || '3001',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '3306', 10),
  dbUsername: process.env.DB_USERNAME || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbDatabase: process.env.DB_DATABASE || 'branch_buddy',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-please-change-this',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

  // Super Admin Credentials for Seeding
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'superadmin@branchbuddy.app',
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdminP@ssw0rd!', // Ensure this is strong and changed
};
