
import { Entity, Column, ManyToOne, JoinColumn, Unique, Check } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AcademicClass } from './academic-class.entity';
import { FeeCategory } from './fee-category.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     FeeStructure:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         academicClass:
 *           $ref: '#/components/schemas/AcademicClass'
 *         feeCategory:
 *           $ref: '#/components/schemas/FeeCategory'
 *         amount:
 *           type: number
 *           format: float
 *           description: The amount for this fee category and class.
 *           example: 15000.00
 *         academicYear:
 *           type: string
 *           description: The academic year for which this fee structure applies (e.g., '2024-2025').
 *           example: '2024-2025'
 *       required:
 *         - academicClass
 *         - feeCategory
 *         - amount
 *         - academicYear
 */
@Entity('fee_structures')
@Unique(['academicClass', 'feeCategory', 'academicYear']) // A class can only have one amount for a fee category per year
@Check(`"amount" > 0`)
export class FeeStructure extends BaseEntity {
  @ManyToOne(() => AcademicClass, (ac) => ac.feeStructures, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'academicClassId' })
  academicClass!: AcademicClass;

  @ManyToOne(() => FeeCategory, (fc) => fc.feeStructures, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'feeCategoryId' })
  feeCategory!: FeeCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ length: 20 }) // e.g., 2024-2025
  academicYear!: string;
}
