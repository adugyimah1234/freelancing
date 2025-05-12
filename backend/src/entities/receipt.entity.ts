
import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Student } from './student.entity';
import { User } from './user.entity';
import { FeePayment } from './fee-payment.entity';

export enum ReceiptType {
  REGISTRATION = 'registration',
  TUITION_FEE = 'tuition_fee',
  OTHER = 'other',
}

/**
 * @openapi
 * components:
 *   schemas:
 *     Receipt:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         receiptNumber:
 *           type: string
 *           unique: true
 *           description: Unique number for the receipt.
 *           example: 'RCPT2024001'
 *         student:
 *           $ref: '#/components/schemas/Student'
 *           nullable: true
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *         receiptType:
 *           type: string
 *           enum: [registration, tuition_fee, other]
 *           description: Type of the receipt.
 *         amount:
 *           type: number
 *           format: float
 *           description: Amount paid.
 *           example: 5000.00
 *         paymentDate:
 *           type: string
 *           format: date
 *           description: Date of payment.
 *           example: '2024-07-15'
 *         paymentMethod:
 *           type: string
 *           nullable: true
 *           description: Method of payment (e.g., Cash, Card, Bank Transfer).
 *           example: 'Cash'
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Any notes related to the payment or receipt.
 *       required:
 *         - receiptNumber
 *         - createdBy
 *         - receiptType
 *         - amount
 *         - paymentDate
 */
@Entity('receipts')
export class Receipt extends BaseEntity {
  @Column({ unique: true, length: 50 })
  receiptNumber!: string; // Should be generated (e.g., based on branch + sequence)

  @ManyToOne(() => Student, (student) => student.receipts, { nullable: true, onDelete: 'SET NULL' }) // Nullable if it's a general receipt not tied to a student initially
  @JoinColumn({ name: 'studentId' })
  student?: Student | null;

  @ManyToOne(() => User, (user) => user.receiptsGenerated, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @Column({
    type: 'enum',
    enum: ReceiptType,
  })
  receiptType!: ReceiptType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  paymentDate!: Date;

  @Column({ length: 50, nullable: true })
  paymentMethod?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // If a receipt is specifically for a fee payment
  @OneToOne(() => FeePayment, (feePayment) => feePayment.receipt, { nullable: true, onDelete: 'SET NULL' })
  feePayment?: FeePayment | null;
}
