
import { AppDataSource } from '../config/data-source';
import { User, UserStatus } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Branch } from '../entities/branch.entity';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { AppError } from '../utils/app-error';
import { FindManyOptions, FindOptionsWhere, In } from 'typeorm';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);
  private branchRepository = AppDataSource.getRepository(Branch);

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, roleId, branchId, status, avatarUrl } = createUserDto;

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new AppError('Role not found', 404);
    }

    let branch: Branch | null = null;
    if (branchId) {
      branch = await this.branchRepository.findOneBy({ id: branchId });
      if (!branch) {
        throw new AppError('Branch not found', 404);
      }
    }

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password; // Hashing will be done by @BeforeInsert hook
    user.role = role;
    user.branch = branch;
    user.status = status || UserStatus.INVITED;
    user.avatarUrl = avatarUrl;

    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
        where: { id },
        relations: ['role', 'branch', 'role.permissions'] // Eager load role with its permissions
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    // Need to explicitly select password for auth purposes
    return this.userRepository.createQueryBuilder("user")
        .select(["user", "user.password"]) // Select all user fields and explicitly password
        .leftJoinAndSelect("user.role", "role")
        .leftJoinAndSelect("user.branch", "branch")
        .leftJoinAndSelect("role.permissions", "permissions")
        .where("user.email = :email", { email })
        .getOne();
  }

  async findAll(options?: FindManyOptions<User>): Promise<[User[], number]> {
     const defaultOptions: FindManyOptions<User> = {
      relations: ['role', 'branch'], // Default relations to load
      order: { createdAt: 'DESC' }, // Default order
    };
    return this.userRepository.findAndCount({ ...defaultOptions, ...options });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent email collision if email is being changed
    if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOneBy({ email: updateUserDto.email });
        if (existingUser && existingUser.id !== id) {
            throw new AppError('Email already in use by another user', 409);
        }
    }
    
    if (updateUserDto.roleId && updateUserDto.roleId !== user.role.id) {
        const role = await this.roleRepository.findOneBy({ id: updateUserDto.roleId });
        if (!role) throw new AppError('New role not found', 404);
        user.role = role;
    }

    if (updateUserDto.branchId !== undefined) { // Allows setting branchId to null
        if (updateUserDto.branchId === null) {
            user.branch = null;
        } else {
            const branch = await this.branchRepository.findOneBy({ id: updateUserDto.branchId });
            if (!branch) throw new AppError('New branch not found', 404);
            user.branch = branch;
        }
    }
    
    // Update fields selectively
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) user.password = updateUserDto.password; // Hashing by @BeforeUpdate
    if (updateUserDto.status) user.status = updateUserDto.status;
    if (updateUserDto.avatarUrl) user.avatarUrl = updateUserDto.avatarUrl;

    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new AppError('User not found', 404);
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }
}
