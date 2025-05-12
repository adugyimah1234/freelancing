
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { getTokenFromRequest, verifyToken, AuthenticatedUser } from '../utils/auth.utils';

// Extend Express Request type to include 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(new AppError('Authentication token is missing.', 401));
  }

  const decodedUser = verifyToken(token);
  if (!decodedUser) {
    return next(new AppError('Invalid or expired token.', 401));
  }

  req.user = decodedUser; // Attach user information to the request object
  next();
};
