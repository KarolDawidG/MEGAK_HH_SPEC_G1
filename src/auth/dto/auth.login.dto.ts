import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsEmail({}, { message: 'email' })
  email: string;
  @IsNotEmpty({ message: 'password' }) //@TODO: set the password validation (number of characters and other conditions)
  password: string;
}
