
import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Student } from './student.entity';
import { Receipt } from './receipt.entity';
import { FeeStructure } from './fee-structure.entity'; // For associating payment to a specific fee structure item if needed

/**
 * @openapi
 * components:
 *   schemas:
 *     FeePayment:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         student:
 *           $ref: '#/components/schemas/Student'
 *         receipt:
 *           $ref: '#/components/schemas/Receipt'
 *         feeStructure:
 *           $ref: '#/components/schemas/FeeStructure'
 *           nullable: true
 *           description: The specific fee structure item this payment applies to (optional).
 *         academicYear:
 *           type: string
 *           description: Academic year for the payment.
 *           example: '2024-2025'
 *         termOrInstallment:
 *           type: string
 *           description: Term or installment number/name.
 *           example: 'Term 1'
 *         amountPaid:
 *           type: number
 *           format: float
 *           description: Amount paid for this installment.
 *           example: 5000.00
 *         paymentDate:
 *           type: string
 *           format: date
 *           description: Date of payment.
 *           example: '2024-07-15'
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Notes related to this specific fee payment.
 *       required:
 *         - student
 *         - receipt
 *         - academicYear
 *         - termOrInstallment
 *         - amountPaid
 *         - paymentDate
 */
@Entity('fee_payments')
export class FeePayment extends BaseEntity {
  @ManyToOne(() => Student, (student) => student.feePayments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student!: Student;

  @OneToOne(() => Receipt, (receipt) => receipt.feePayment, { nullable: false, cascade: true, onDelete: 'CASCADE' }) // A fee payment must have a receipt
  @JoinColumn({ name: 'receiptId' })
  receipt!: Receipt;

  @ManyToOne(() => FeeStructure, { nullable: true, onDelete: 'SET NULL' }) // Optional link to a specific fee item
  @JoinColumn({ name: 'feeStructureId' })
  feeStructure?: FeeStructure | null;

  @Column({ length: 20 }) // e.g., 2024-2025
  academicYear!: string;

  @Column({ length: 50 }) // e.g., "Term 1", "Installment 2"
  termOrInstallment!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPaid!: number;

  @Column({ type: 'date' })
  paymentDate!: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
