
import { IsString, MinLength, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateRoleDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the role.
 *           example: 'Content Editor'
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description for the role.
 *         permissionIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of permission IDs to assign to this role.
 *           example: ["p1id", "p2id"]
 */
export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  permissionIds?: string[];
}
