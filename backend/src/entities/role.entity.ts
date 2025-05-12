
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';

export enum DefaultRole {
  SUPER_ADMIN = 'Super Admin',
  BRANCH_ADMIN = 'Branch Admin',
  ACCOUNTANT = 'Accountant',
  FRONT_DESK = 'Front Desk',
  TEACHER = 'Teacher',
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the role (e.g., Super Admin, Branch Admin).
 *           example: 'Branch Admin'
 *           unique: true
 *         description:
 *           type: string
 *           nullable: true
 *           description: A brief description of the role.
 *           example: 'Manages a specific branch and its operations.'
 *         isDefault:
 *           type: boolean
 *           description: Indicates if this is a system-defined default role.
 *           example: false
 *           default: false
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *           description: List of permissions associated with this role.
 *       required:
 *         - name
 */
@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true, length: 100 })
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ default: false })
  isDefault!: boolean;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true, // Persist new permissions when a role is saved
    eager: true, // Load permissions when a role is fetched
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions!: Permission[];
}
