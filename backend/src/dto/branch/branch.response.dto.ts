
import { Expose } from 'class-transformer';

/**
 * @openapi
 * components:
 *   schemas:
 *     BranchResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         address:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *         logoUrl:
 *           type: string
 *           format: url
 *           nullable: true
 *         primaryColor:
 *           type: string
 *           format: hexcolor
 *           nullable: true
 *         secondaryColor:
 *           type: string
 *           format: hexcolor
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class BranchResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  address?: string;

  @Expose()
  phone?: string;

  @Expose()
  email?: string;
  
  @Expose()
  logoUrl?: string;

  @Expose()
  primaryColor?: string;

  @Expose()
  secondaryColor?: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
