
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Student } from './student.entity';
import { AcademicClass } from './academic-class.entity';
import { Exam } from './exam.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the school branch.
 *           example: 'Main Campus'
 *         address:
 *           type: string
 *           nullable: true
 *           description: Physical address of the branch.
 *           example: '123 Education Lane, Knowledgetown, ED 45678'
 *         phone:
 *           type: string
 *           nullable: true
 *           description: Contact phone number for the branch.
 *           example: '+1 (555) 123-4567'
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: Contact email address for the branch.
 *           example: 'maincampus@branchbuddy.app'
 *         logoUrl:
 *           type: string
 *           format: url
 *           nullable: true
 *           description: URL of the branch logo.
 *         primaryColor:
 *           type: string
 *           nullable: true
 *           description: Primary theme color for the branch (hex code).
 *           example: '#3498db'
 *         secondaryColor:
 *           type: string
 *           nullable: true
 *           description: Secondary theme color for the branch (hex code).
 *           example: '#ecf0f1'
 *       required:
 *         - name
 */
@Entity('branches')
export class Branch extends BaseEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ length: 50, nullable: true })
  phone?: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  logoUrl?: string;

  @Column({ length: 20, nullable: true })
  primaryColor?: string;
  
  @Column({ length: 20, nullable: true })
  secondaryColor?: string;

  @OneToMany(() => User, (user) => user.branch)
  users!: User[];

  @OneToMany(() => Student, (student) => student.branch)
  students!: Student[];

  @OneToMany(() => AcademicClass, (academicClass) => academicClass.branch)
  academicClasses!: AcademicClass[];

  @OneToMany(() => Exam, (exam) => exam.branch)
  exams!: Exam[];
}
