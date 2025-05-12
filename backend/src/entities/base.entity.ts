
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity as TypeOrmBaseEntity } from 'typeorm';

/**
 * @openapi
 * components:
 *   schemas:
 *     BaseEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated UUID of the entity.
 *           example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of entity creation.
 *           example: "2024-07-30T09:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update.
 *           example: "2024-07-30T09:30:00.000Z"
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
