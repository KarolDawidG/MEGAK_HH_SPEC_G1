import { IsEmail } from 'class-validator';
import { messages } from '../../config/messages';

export class UserChangePasswordDto {
  @IsEmail({}, { message: messages.invalidEmail })
  email: string;
}
