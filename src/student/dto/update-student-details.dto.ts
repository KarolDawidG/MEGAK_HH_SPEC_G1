import {
  contractTypeEnum,
  StudentInterface,
  studentStatus,
  workTypeEnum,
} from '../../interfaces/StudentInterface';

import {
  Contains, IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString, IsUrl,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateStudentDetailsDto implements Partial<StudentInterface> {
  @IsEmail()
  @IsNotEmpty()
  email: string | null;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string | null;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  githubName: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, {each: true})
  @IsString({ each: true })
  portfolioUrl?: string[] | null;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, {each: true})
  @Contains('https://github.com', { each: true })
  bonusProjectUrl: string[];

  @IsOptional()
  @IsString()
  bio?: string | null;

  @IsNotEmpty()
  @IsEnum(workTypeEnum)
  expectedWorkType: workTypeEnum;

  @IsString()
  targetWorkCity?: string;

  @IsNotEmpty()
  @IsEnum(contractTypeEnum)
  expectedContractType: contractTypeEnum;

  @IsOptional()
  @IsNumber()
  expectedSalary?: number | null;

  @IsNotEmpty()
  @IsBoolean()
  canTakeApprenticeship: boolean;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  monthsOfCommercialExperience: number;

  @IsOptional()
  @IsString()
  education?: string | null;

  @IsOptional()
  @IsString()
  workExperience?: string | null;

  @IsOptional()
  @IsString()
  courses?: string | null;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(studentStatus)
  status?: studentStatus;
}

export class UpdateStudentDetailsDto extends PartialType(
  CreateStudentDetailsDto,
) {}
