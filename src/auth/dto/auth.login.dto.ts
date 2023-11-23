import { IsEmail, IsNotEmpty } from 'class-validator';
import { messages } from '../../config/messages';

export class AuthLoginDto {
  @IsEmail({}, { message: messages.invalidEmail })
  email: string;
  @IsNotEmpty({ message: messages.invalidPassword }) //@TODO: set the password validation (number of characters and other conditions)
  password: string;
}
