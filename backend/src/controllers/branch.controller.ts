
import type { Request, Response, NextFunction } from 'express';
import { BranchService } from '../services/branch.service';
import { CreateBranchDto } from '../dto/branch/create-branch.dto';
import { UpdateBranchDto } from '../dto/branch/update-branch.dto';
import { plainToInstance } from 'class-transformer';
import { BranchResponseDto } from '../dto/branch/branch.response.dto';
import { AppError } from '../utils/app-error';

export class BranchController {
  private branchService = new BranchService();

  /**
   * @openapi
   * /branches:
   *   post:
   *     tags: [Branches]
   *     summary: Create a new branch
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateBranchDto'
   *     responses:
   *       201:
   *         description: Branch created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BranchResponseDto'
   *       400:
   *         description: Invalid input
   *       409:
   *         description: Branch with this name already exists
   */
  createBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createBranchDto = plainToInstance(CreateBranchDto, req.body);
      // TODO: Add validation
      const branch = await this.branchService.createBranch(createBranchDto);
      res.status(201).json(plainToInstance(BranchResponseDto, branch, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /branches/{id}:
   *   get:
   *     tags: [Branches]
   *     summary: Get a branch by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The branch ID
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BranchResponseDto'
   *       404:
   *         description: Branch not found
   */
  getBranchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const branch = await this.branchService.findById(req.params.id);
      if (!branch) {
        throw new AppError('Branch not found', 404);
      }
      res.status(200).json(plainToInstance(BranchResponseDto, branch, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /branches:
   *   get:
   *     tags: [Branches]
   *     summary: Get all branches
   *     responses:
   *       200:
   *         description: A list of branches
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/BranchResponseDto'
   */
  getAllBranches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Add pagination
      const [branches, total] = await this.branchService.findAll();
      res.status(200).json({
        data: plainToInstance(BranchResponseDto, branches, { excludeExtraneousValues: true }),
        total,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /branches/{id}:
   *   patch:
   *     tags: [Branches]
   *     summary: Update a branch
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The branch ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateBranchDto'
   *     responses:
   *       200:
   *         description: Branch updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BranchResponseDto'
   *       400:
   *         description: Invalid input
   *       404:
   *         description: Branch not found
   *       409:
   *         description: Another branch with this name already exists
   */
  updateBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updateBranchDto = plainToInstance(UpdateBranchDto, req.body);
      // TODO: Add validation
      const branch = await this.branchService.updateBranch(req.params.id, updateBranchDto);
      res.status(200).json(plainToInstance(BranchResponseDto, branch, { excludeExtraneousValues: true }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /branches/{id}:
   *   delete:
   *     tags: [Branches]
   *     summary: Delete a branch
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The branch ID
   *     responses:
   *       204:
   *         description: Branch deleted successfully
   *       400:
   *         description: Branch has associated data (users, students)
   *       404:
   *         description: Branch not found
   */
  deleteBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.branchService.deleteBranch(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
