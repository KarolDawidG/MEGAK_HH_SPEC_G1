import { IsNotEmpty, IsString } from 'class-validator';

export class UserChangeSelfPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  repeatNewPassword: string;
}
