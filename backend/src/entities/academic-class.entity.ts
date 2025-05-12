
import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Branch } from './branch.entity';
import { Student } from './student.entity';
import { FeeStructure } from './fee-structure.entity';
import { Exam } from './exam.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     AcademicClass:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the class (e.g., 'Grade 10A', 'Nursery Blue').
 *           example: 'Grade 10A'
 *         branch:
 *           $ref: '#/components/schemas/Branch'
 *         description:
 *           type: string
 *           nullable: true
 *           description: Optional description for the class.
 *       required:
 *         - name
 *         - branch
 */
@Entity('academic_classes')
@Unique(['name', 'branch']) // Class name should be unique within a branch
export class AcademicClass extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Branch, (branch) => branch.academicClasses, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branchId' })
  branch!: Branch;

  @OneToMany(() => Student, (student) => student.academicClass)
  students!: Student[];

  @OneToMany(() => FeeStructure, (feeStructure) => feeStructure.academicClass)
  feeStructures!: FeeStructure[];

  @ManyToMany(() => Exam, (exam) => exam.academicClasses)
  exams!: Exam[];
}
