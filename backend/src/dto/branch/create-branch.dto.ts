
import { IsString, MinLength, IsNotEmpty, IsOptional, IsEmail, IsHexColor, IsUrl } from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateBranchDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the branch.
 *           example: "North Campus"
 *         address:
 *           type: string
 *           nullable: true
 *           description: Branch address.
 *         phone:
 *           type: string
 *           nullable: true
 *           description: Branch phone number.
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: Branch email.
 *         logoUrl:
 *           type: string
 *           format: url
 *           nullable: true
 *         primaryColor:
 *           type: string
 *           format: hexcolor
 *           nullable: true
 *         secondaryColor:
 *           type: string
 *           format: hexcolor
 *           nullable: true
 */
export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsHexColor()
  primaryColor?: string;

  @IsOptional()
  @IsHexColor()
  secondaryColor?: string;
}
