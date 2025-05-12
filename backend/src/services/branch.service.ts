
import { AppDataSource } from '../config/data-source';
import { Branch } from '../entities/branch.entity';
import { CreateBranchDto } from '../dto/branch/create-branch.dto';
import { UpdateBranchDto } from '../dto/branch/update-branch.dto';
import { AppError } from '../utils/app-error';
import { FindManyOptions } from 'typeorm';

export class BranchService {
  private branchRepository = AppDataSource.getRepository(Branch);

  async createBranch(createBranchDto: CreateBranchDto): Promise<Branch> {
    const { name, address, phone, email, logoUrl, primaryColor, secondaryColor } = createBranchDto;

    const existingBranch = await this.branchRepository.findOneBy({ name });
    if (existingBranch) {
      throw new AppError('Branch with this name already exists', 409);
    }

    const branch = new Branch();
    branch.name = name;
    branch.address = address;
    branch.phone = phone;
    branch.email = email;
    branch.logoUrl = logoUrl;
    branch.primaryColor = primaryColor;
    branch.secondaryColor = secondaryColor;

    return this.branchRepository.save(branch);
  }

  async findById(id: string): Promise<Branch | null> {
    return this.branchRepository.findOneBy({ id });
  }

  async findAll(options?: FindManyOptions<Branch>): Promise<[Branch[], number]> {
    const defaultOptions: FindManyOptions<Branch> = {
      order: { name: 'ASC' }, // Default order
    };
    return this.branchRepository.findAndCount({ ...defaultOptions, ...options });
  }

  async updateBranch(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findById(id);
    if (!branch) {
      throw new AppError('Branch not found', 404);
    }
    
    if (updateBranchDto.name && updateBranchDto.name !== branch.name) {
        const existingBranch = await this.branchRepository.findOneBy({ name: updateBranchDto.name });
        if (existingBranch && existingBranch.id !== id) {
            throw new AppError('Another branch with this name already exists', 409);
        }
        branch.name = updateBranchDto.name;
    }

    if (updateBranchDto.address !== undefined) branch.address = updateBranchDto.address;
    if (updateBranchDto.phone !== undefined) branch.phone = updateBranchDto.phone;
    if (updateBranchDto.email !== undefined) branch.email = updateBranchDto.email;
    if (updateBranchDto.logoUrl !== undefined) branch.logoUrl = updateBranchDto.logoUrl;
    if (updateBranchDto.primaryColor !== undefined) branch.primaryColor = updateBranchDto.primaryColor;
    if (updateBranchDto.secondaryColor !== undefined) branch.secondaryColor = updateBranchDto.secondaryColor;
    

    return this.branchRepository.save(branch);
  }

  async deleteBranch(id: string): Promise<void> {
    // Add checks here if branch has associated users, students, etc. before deletion
    // For example:
    // const userCount = await AppDataSource.getRepository(User).count({ where: { branch: { id } } });
    // if (userCount > 0) throw new AppError('Cannot delete branch with associated users', 400);

    const result = await this.branchRepository.delete(id);
    if (result.affected === 0) {
      throw new AppError('Branch not found', 404);
    }
  }
}
