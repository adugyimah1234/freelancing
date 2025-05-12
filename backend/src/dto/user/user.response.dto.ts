
import { Exclude, Expose, Type } from 'class-transformer';
import { RoleResponseDto } from '../role/role.response.dto';
import { BranchResponseDto } from '../branch/branch.response.dto';
import { UserStatus } from '../../entities/user.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         status:
 *           $ref: '#/components/schemas/UserStatusEnum'
 *         role:
 *           $ref: '#/components/schemas/RoleResponseDto'
 *         branch:
 *           $ref: '#/components/schemas/BranchResponseDto'
 *           nullable: true
 *         avatarUrl:
 *           type: string
 *           format: url
 *           nullable: true
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  status!: UserStatus;

  @Expose()
  @Type(() => RoleResponseDto)
  role!: RoleResponseDto;

  @Expose()
  @Type(() => BranchResponseDto)
  branch?: BranchResponseDto | null;
  
  @Expose()
  avatarUrl?: string;

  @Expose()
  lastLogin?: Date | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  // Exclude password by default, it's also marked with select: false in entity
  @Exclude()
  password!: string;
}
