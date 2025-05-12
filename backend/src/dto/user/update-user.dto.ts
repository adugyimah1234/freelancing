
import { IsEmail, IsString, MinLength, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { UserStatus } from '../../entities/user.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user.
 *           example: Johnathan Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user.
 *           example: johnathan.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: New password for the user (min 6 characters, optional).
 *           example: "newSecurePassword123"
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: ID of the new role to assign to the user.
 *         branchId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the new branch for the user. Can be null.
 *         status:
 *           $ref: '#/components/schemas/UserStatusEnum'
 *         avatarUrl:
 *           type: string
 *           format: url
 *           nullable: true
 *           description: URL for user's avatar.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsUUID()
  branchId?: string | null;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
  
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
