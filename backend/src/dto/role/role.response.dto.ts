
import { Expose, Type } from 'class-transformer';
import { PermissionResponseDto } from '../permission/permission.response.dto';

/**
 * @openapi
 * components:
 *   schemas:
 *     RoleResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         isDefault:
 *           type: boolean
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PermissionResponseDto'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class RoleResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description?: string;

  @Expose()
  isDefault!: boolean;

  @Expose()
  @Type(() => PermissionResponseDto)
  permissions!: PermissionResponseDto[];
  
  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
