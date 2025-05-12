
import { IsString, MinLength, IsOptional, IsArray, IsUUID } from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateRoleDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: New name for the role.
 *           example: 'Senior Content Editor'
 *         description:
 *           type: string
 *           nullable: true
 *           description: New description for the role.
 *         permissionIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: Array of permission IDs to assign/replace for this role.
 *           example: ["p3id", "p4id"]
 */
export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  permissionIds?: string[];
}
