
import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/app-error';
import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user/user.response.dto';

export class AuthController {
  private userService = new UserService();

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      const user = await this.userService.findByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid email or password', 401);
      }
      
      if (user.status !== 'active') {
        throw new AppError(`User account is ${user.status}. Please contact administrator.`, 403);
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role.name, // Include role name in token for easier client-side checks if needed
        branchId: user.branch?.id
      };

      const accessToken = jwt.sign(payload, environment.jwtSecret, {
        expiresIn: environment.jwtExpiresIn,
      });

      // Update last login timestamp
      await this.userService.updateLastLogin(user.id);

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Assuming authMiddleware has populated req.user
      const userId = (req as any).user?.id; 
      if (!userId) {
        // This case should ideally be caught by authMiddleware
        throw new AppError('User not authenticated or user ID not found in token', 401);
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new AppError('User profile not found', 404);
      }
      res.status(200).json(plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  // TODO: Implement forgotPassword, resetPassword methods
}
