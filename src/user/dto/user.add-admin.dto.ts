import { IsEmail } from 'class-validator';

export class UserAddAdminDto {
  @IsEmail()
  email: string;
}
