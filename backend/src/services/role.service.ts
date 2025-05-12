
import { AppDataSource } from '../config/data-source';
import { Role, DefaultRole } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { CreateRoleDto } from '../dto/role/create-role.dto';
import { UpdateRoleDto } from '../dto/role/update-role.dto';
import { AppError } from '../utils/app-error';
import { In, FindManyOptions } from 'typeorm';

export class RoleService {
  private roleRepository = AppDataSource.getRepository(Role);
  private permissionRepository = AppDataSource.getRepository(Permission);

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, description, permissionIds } = createRoleDto;

    const existingRole = await this.roleRepository.findOneBy({ name });
    if (existingRole) {
      throw new AppError('Role with this name already exists', 409);
    }

    const role = new Role();
    role.name = name;
    role.description = description;
    role.isDefault = false; // User-created roles are not default

    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
      if (permissions.length !== permissionIds.length) {
        throw new AppError('One or more permissions not found', 404);
      }
      role.permissions = permissions;
    } else {
      role.permissions = [];
    }

    return this.roleRepository.save(role);
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleRepository.findOne({
        where: { id },
        relations: ['permissions']
    });
  }
  
  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
        where: { name },
        relations: ['permissions']
    });
  }

  async findAll(options?: FindManyOptions<Role>): Promise<[Role[], number]> {
    const defaultOptions: FindManyOptions<Role> = {
      relations: ['permissions'], // Default relations to load
      order: { name: 'ASC' }, // Default order
    };
    return this.roleRepository.findAndCount({ ...defaultOptions, ...options });
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    if (role.isDefault && Object.values(DefaultRole).includes(role.name as DefaultRole)) {
        throw new AppError(`Default role '${role.name}' cannot be modified extensively.`, 403);
    }


    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
        const existingRole = await this.roleRepository.findOneBy({ name: updateRoleDto.name });
        if (existingRole && existingRole.id !== id) {
            throw new AppError('Another role with this name already exists', 409);
        }
        role.name = updateRoleDto.name;
    }
    
    if (updateRoleDto.description !== undefined) {
        role.description = updateRoleDto.description;
    }

    if (updateRoleDto.permissionIds) {
      if (updateRoleDto.permissionIds.length > 0) {
        const permissions = await this.permissionRepository.findBy({ id: In(updateRoleDto.permissionIds) });
        if (permissions.length !== updateRoleDto.permissionIds.length) {
          throw new AppError('One or more permissions not found for update', 404);
        }
        role.permissions = permissions;
      } else {
        role.permissions = []; // Clear permissions if an empty array is provided
      }
    }

    return this.roleRepository.save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.findById(id);
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    if (role.isDefault) {
      throw new AppError('Default roles cannot be deleted', 403);
    }
    // Add check for users assigned to this role before deletion
    const usersWithRole = await AppDataSource.getRepository(User).count({ where: { role: { id: role.id } }});
    if (usersWithRole > 0) {
        throw new AppError(`Cannot delete role '${role.name}' as it is assigned to ${usersWithRole} user(s).`, 400);
    }

    await this.roleRepository.remove(role);
  }

  // TODO: Add seed method for default roles and permissions
}
