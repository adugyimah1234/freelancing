
import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Student } from './student.entity';

/**
 * @openapi
 * components:
 *   schemas:
 *     Parent:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the parent/guardian.
 *           example: 'Jane Doe'
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: Email address of the parent/guardian.
 *           example: 'jane.doe@example.com'
 *         phone:
 *           type: string
 *           description: Phone number of the parent/guardian.
 *           example: '+1 (555) 987-6543'
 *         address:
 *           type: string
 *           nullable: true
 *           description: Address of the parent/guardian.
 *         occupation:
 *           type: string
 *           nullable: true
 *           description: Occupation of the parent/guardian.
 *       required:
 *         - name
 *         - phone
 */
@Entity('parents')
export class Parent extends BaseEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, nullable: true, unique: true }) // Making email unique if provided
  email?: string;

  @Column({ length: 50 })
  phone!: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ length: 255, nullable: true })
  occupation?: string;

  @ManyToMany(() => Student, (student) => student.parents)
  students!: Student[];
}
