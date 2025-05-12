
import { Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Branch } from './branch.entity';
import { AcademicClass } from './academic-class.entity';
import { Parent } from './parent.entity';
import { FeePayment } from './fee-payment.entity';
import { Receipt } from './receipt.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  GRADUATED = 'graduated',
  TRANSFERRED = 'transferred',
  PROSPECT = 'prospect', // For new admissions not yet confirmed
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         firstName:
 *           type: string
 *           description: Student's first name.
 *           example: 'Alice'
 *         lastName:
 *           type: string
 *           description: Student's last name.
 *           example: 'Smith'
 *         middleName:
 *           type: string
 *           nullable: true
 *           description: Student's middle name.
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Student's date of birth.
 *           example: '2010-05-15'
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Student's gender.
 *         admissionNumber:
 *           type: string
 *           unique: true
 *           description: Unique admission number for the student.
 *           example: 'ADM2024001'
 *         admissionDate:
 *           type: string
 *           format: date
 *           description: Date of admission.
 *           example: '2024-04-01'
 *         status:
 *           type: string
 *           enum: [active, inactive, graduated, transferred, prospect]
 *           default: prospect
 *           description: Current status of the student.
 *         branch:
 *           $ref: '#/components/schemas/Branch'
 *         academicClass:
 *           $ref: '#/components/schemas/AcademicClass'
 *           nullable: true
 *         profilePhotoUrl:
 *           type: string
 *           format: url
 *           nullable: true
 *           description: URL of the student's profile photo.
 *         address:
 *           type: string
 *           nullable: true
 *           description: Student's residential address.
 *         parents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Parent'
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - gender
 *         - admissionNumber
 *         - admissionDate
 *         - branch
 */
@Entity('students')
export class Student extends BaseEntity {
  @Column({ length: 100 })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Column({ length: 100, nullable: true })
  middleName?: string;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender!: Gender;

  @Column({ unique: true, length: 50 })
  admissionNumber!: string; // Should be unique across the entire system or per branch? For now, system-wide.

  @Column({ type: 'date' })
  admissionDate!: Date;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.PROSPECT,
  })
  status!: StudentStatus;

  @ManyToOne(() => Branch, (branch) => branch.students, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'branchId' })
  branch!: Branch;

  @ManyToOne(() => AcademicClass, (academicClass) => academicClass.students, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'academicClassId' })
  academicClass?: AcademicClass | null;
  
  @Column({ type: 'varchar', length: 512, nullable: true })
  profilePhotoUrl?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @ManyToMany(() => Parent, (parent) => parent.students, { cascade: true, eager: true })
  @JoinTable({
    name: 'student_parents',
    joinColumn: { name: 'studentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'parentId', referencedColumnName: 'id' },
  })
  parents!: Parent[];

  @OneToMany(() => FeePayment, (payment) => payment.student)
  feePayments!: FeePayment[];

  @OneToMany(() => Receipt, (receipt) => receipt.student)
  receipts!: Receipt[];
}
