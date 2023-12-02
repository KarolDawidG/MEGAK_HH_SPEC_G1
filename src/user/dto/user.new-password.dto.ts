import { IsNotEmpty } from 'class-validator';
import { messages } from '../../config/messages';

export class UserNewPasswordDto {
  @IsNotEmpty({ message: messages.invalidPassword }) //@TODO: set the password validation (number of characters and other conditions)
  password: string;
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  token: string;
}
