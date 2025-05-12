
import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user/user.response.dto';
import { AppError } from '../utils/app-error';

export class UserController {
  private userService = new UserService();

  /**
   * @openapi
   * /users:
   *   post:
   *     tags: [Users]
   *     summary: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponseDto'
   *       400:
   *         description: Invalid input
   *       404:
   *         description: Role or Branch not found
   *       409:
   *         description: User with this email already exists
   */
  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createUserDto = plainToInstance(CreateUserDto, req.body);
      // TODO: Add validation for createUserDto using class-validator
      const user = await this.userService.createUser(createUserDto);
      res.status(201).json(plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     tags: [Users]
   *     summary: Get a user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The user ID
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponseDto'
   *       404:
   *         description: User not found
   */
  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.status(200).json(plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /users:
   *   get:
   *     tags: [Users]
   *     summary: Get all users
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/UserResponseDto'
   *                 total:
   *                   type: integer
   *                 page:
   *                   type: integer
   *                 limit:
   *                   type: integer
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await this.userService.findAll({ skip, take: limit });
      res.status(200).json({
        data: plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true }),
        total,
        page,
        limit,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /users/{id}:
   *   patch:
   *     tags: [Users]
   *     summary: Update a user
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserDto'
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponseDto'
   *       400:
   *         description: Invalid input
   *       404:
   *         description: User, Role, or Branch not found
   *       409:
   *         description: Email already in use
   */
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updateUserDto = plainToInstance(UpdateUserDto, req.body);
      // TODO: Add validation for updateUserDto
      const user = await this.userService.updateUser(req.params.id, updateUserDto);
      res.status(200).json(plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /users/{id}:
   *   delete:
   *     tags: [Users]
   *     summary: Delete a user
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The user ID
   *     responses:
   *       204:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
