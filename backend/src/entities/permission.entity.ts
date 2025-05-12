
import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the permission (e.g., 'create_user', 'view_reports').
 *           example: 'create_user'
 *           unique: true
 *         description:
 *           type: string
 *           nullable: true
 *           description: A brief description of what the permission allows.
 *           example: 'Allows creating new user accounts.'
 *         category:
 *           type: string
 *           description: Category for grouping permissions (e.g., 'User Management', 'Student Records').
 *           example: 'User Management'
 *       required:
 *         - name
 *         - category
 */
@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ unique: true, length: 100 })
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ length: 100 })
  category!: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];
}
