
import { Expose } from 'class-transformer';

/**
 * @openapi
 * components:
 *   schemas:
 *     PermissionResponseDto:
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
 *         category:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class PermissionResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description?: string;

  @Expose()
  category!: string;
  
  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
