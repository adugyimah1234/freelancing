
import type { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/role/create-role.dto';
import { UpdateRoleDto } from '../dto/role/update-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleResponseDto } from '../dto/role/role.response.dto';
import { AppError } from '../utils/app-error';

export class RoleController {
  private roleService = new RoleService();

  /**
   * @openapi
   * /roles:
   *   post:
   *     tags: [Roles]
   *     summary: Create a new role
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRoleDto'
   *     responses:
   *       201:
   *         description: Role created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RoleResponseDto'
   *       400:
   *         description: Invalid input or Permission not found
   *       409:
   *         description: Role with this name already exists
   */
  createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createRoleDto = plainToInstance(CreateRoleDto, req.body);
      // TODO: Add validation
      const role = await this.roleService.createRole(createRoleDto);
      res.status(201).json(plainToInstance(RoleResponseDto, role, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /roles/{id}:
   *   get:
   *     tags: [Roles]
   *     summary: Get a role by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The role ID
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RoleResponseDto'
   *       404:
   *         description: Role not found
   */
  getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const role = await this.roleService.findById(req.params.id);
      if (!role) {
        throw new AppError('Role not found', 404);
      }
      res.status(200).json(plainToInstance(RoleResponseDto, role, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /roles:
   *   get:
   *     tags: [Roles]
   *     summary: Get all roles
   *     responses:
   *       200:
   *         description: A list of roles
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RoleResponseDto'
   */
  getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Add pagination similar to users if needed
      const [roles, total] = await this.roleService.findAll();
      res.status(200).json({
        data: plainToInstance(RoleResponseDto, roles, { excludeExtraneousValues: true }),
        total,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /roles/{id}:
   *   patch:
   *     tags: [Roles]
   *     summary: Update a role
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The role ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateRoleDto'
   *     responses:
   *       200:
   *         description: Role updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RoleResponseDto'
   *       400:
   *         description: Invalid input or Permission not found
   *       403:
   *         description: Default role cannot be modified
   *       404:
   *         description: Role not found
   *       409:
   *         description: Another role with this name already exists
   */
  updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updateRoleDto = plainToInstance(UpdateRoleDto, req.body);
      // TODO: Add validation
      const role = await this.roleService.updateRole(req.params.id, updateRoleDto);
      res.status(200).json(plainToInstance(RoleResponseDto, role, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /roles/{id}:
   *   delete:
   *     tags: [Roles]
   *     summary: Delete a role
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The role ID
   *     responses:
   *       204:
   *         description: Role deleted successfully
   *       400:
   *         description: Role is assigned to users
   *       403:
   *         description: Default roles cannot be deleted
   *       404:
   *         description: Role not found
   */
  deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.roleService.deleteRole(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
