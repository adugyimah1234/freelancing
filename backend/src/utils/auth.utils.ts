
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  branchId?: string;
}

export const verifyToken = (token: string): AuthenticatedUser | null => {
  try {
    const decoded = jwt.verify(token, environment.jwtSecret) as AuthenticatedUser;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getTokenFromRequest = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  return null;
};
