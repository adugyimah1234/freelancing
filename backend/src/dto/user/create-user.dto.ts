
import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { UserStatus } from '../../entities/user.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - roleId
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user.
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user.
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters).
 *           example: "securePassword123"
 *         roleId:
 *           type: string
 *           format: uuid
 *           description: ID of the role to assign to the user.
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         branchId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the branch the user belongs to (optional).
 *           example: "b1c2d3e4-f5g6-7890-1234-567890abcdef"
 *         status:
 *           $ref: '#/components/schemas/UserStatusEnum' # Defined below
 *           default: invited
 *           nullable: true
 *         avatarUrl:
 *           type: string
 *           format: url
 *           nullable: true
 *           description: URL for user's avatar.
 *
 *     UserStatusEnum:
 *       type: string
 *       enum: [active, inactive, invited, pending]
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsUUID()
  @IsNotEmpty()
  roleId!: string;

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
