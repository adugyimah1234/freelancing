
import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { FeeStructure } from './fee-structure.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     FeeCategory:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the fee category (e.g., 'Tuition Fee', 'MOD', 'SVC').
 *           example: 'Tuition Fee'
 *           unique: true
 *         description:
 *           type: string
 *           nullable: true
 *           description: A brief description of the fee category.
 *       required:
 *         - name
 */
@Entity('fee_categories')
@Unique(['name'])
export class FeeCategory extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => FeeStructure, (feeStructure) => feeStructure.feeCategory)
  feeStructures!: FeeStructure[];
}
