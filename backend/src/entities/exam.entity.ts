
import { Entity, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Branch } from './branch.entity';
import { AcademicClass } from './academic-class.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     Exam:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the exam (e.g., 'Mid-Term Examination', 'Final Assessment').
 *           example: 'Mid-Term Examination'
 *         branch:
 *           $ref: '#/components/schemas/Branch'
 *         academicYear:
 *           type: string
 *           description: Academic year for the exam.
 *           example: '2024-2025'
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date and time of the exam period.
 *           example: '2024-10-15T09:00:00.000Z'
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: End date and time of the exam period.
 *           example: '2024-10-20T17:00:00.000Z'
 *         venue:
 *           type: string
 *           nullable: true
 *           description: Venue for the exam(s).
 *           example: 'Main Hall / Respective Classrooms'
 *         description:
 *           type: string
 *           nullable: true
 *           description: Additional details or instructions for the exam.
 *         academicClasses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AcademicClass'
 *           description: List of academic classes this exam applies to.
 *       required:
 *         - name
 *         - branch
 *         - academicYear
 *         - startDate
 *         - endDate
 */
@Entity('exams')
export class Exam extends BaseEntity {
  @Column({ length: 255 })
  name!: string;

  @ManyToOne(() => Branch, (branch) => branch.exams, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branchId' })
  branch!: Branch;

  @Column({ length: 20 }) // e.g., 2024-2025
  academicYear!: string;

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @Column({ length: 255, nullable: true })
  venue?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => AcademicClass, (ac) => ac.exams, { cascade: true })
  @JoinTable({
    name: 'exam_classes',
    joinColumn: { name: 'examId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'academicClassId', referencedColumnName: 'id' },
  })
  academicClasses!: AcademicClass[];
}
