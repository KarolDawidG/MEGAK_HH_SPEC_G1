import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UserAddHrDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  company: string;
  @IsNumber()
  @Min(1)
  @Max(999)
  maxReservedStudents: number;
}
