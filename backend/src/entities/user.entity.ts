
import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';
import { Branch } from './branch.entity';
import { Receipt } from './receipt.entity';
import bcrypt from 'bcrypt';
import { OneToMany } from 'typeorm';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  INVITED = 'invited',
  PENDING = 'pending', // For users who have been invited but not yet completed setup
}

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user.
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user (must be unique).
 *           example: john.doe@example.com
 *         status:
 *           type: string
 *           enum: [active, inactive, invited, pending]
 *           description: Current status of the user.
 *           example: active
 *         role:
 *           $ref: '#/components/schemas/Role'
 *         branch:
 *           $ref: '#/components/schemas/Branch'
 *           nullable: true
 *         avatarUrl:
 *           type: string
 *           format: url
 *           nullable: true
 *           description: URL of the user's avatar image.
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Timestamp of the last login.
 *           example: "2024-07-30T10:00:00.000Z"
 *       required:
 *         - name
 *         - email
 *         - role
 *
 *     UserWithPassword:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             password:
 *               type: string
 *               format: password
 *               description: User's password (write-only). Min 6 characters.
 *               example: "password123"
 */
@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255, select: false }) // select: false to not return by default
  password!: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INVITED,
  })
  status!: UserStatus;

  @ManyToOne(() => Role, (role) => role.users, { eager: true, nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @ManyToOne(() => Branch, (branch) => branch.users, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'branchId' })
  branch?: Branch | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatarUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date | null;
  
  @OneToMany(() => Receipt, (receipt) => receipt.createdBy)
  receiptsGenerated!: Receipt[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    if (!this.password) return false; // Should not happen if password is required
    return bcrypt.compare(attempt, this.password);
  }
}
