import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Role } from './role.entity'; // To be created
// import { Branch } from './branch.entity'; // To be created

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
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user.
 *           example: 1
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
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Timestamp of the last login.
 *           example: "2024-07-30T10:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of user creation.
 *           example: "2024-07-30T09:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update.
 *           example: "2024-07-30T09:30:00.000Z"
 *       required:
 *         - name
 *         - email
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INVITED,
  })
  status!: UserStatus;

  // @ManyToOne(() => Role, (role) => role.users, { eager: true, nullable: false })
  // @JoinColumn({ name: 'roleId' })
  // role!: Role;
  @Column() // Temporary, to be replaced by actual Role relation
  roleId!: string;


  // @ManyToOne(() => Branch, (branch) => branch.users, { eager: true, nullable: true })
  // @JoinColumn({ name: 'branchId' })
  // branch?: Branch | null;
  @Column({ nullable: true }) // Temporary, to be replaced by actual Branch relation
  branchId?: string | null;


  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
