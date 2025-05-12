
import { IsString, MinLength, IsOptional, IsEmail, IsHexColor, IsUrl } from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateBranchDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: New name for the branch.
 *         address:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
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
export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

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
