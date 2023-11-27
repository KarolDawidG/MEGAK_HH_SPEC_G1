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
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  company: string;
  @IsNumber()
  @Min(1)
  @Max(199)
  maxReservedStudents: number;
}
