import { IsEmail } from 'class-validator';
import { messages } from '../../config/messages';

export class UserChangePassword {
  @IsEmail({}, { message: messages.invalidEmail })
  email: string;
}
