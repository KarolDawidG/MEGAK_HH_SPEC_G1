import { IsNotEmpty } from 'class-validator';
import { AuthLoginDto } from '../../auth/dto/auth.login.dto';

export class UserNewPassword extends AuthLoginDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  token: string;
}
