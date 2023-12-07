import { IsNotEmpty, IsString } from 'class-validator';

export class UserChangeSelfPasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  repeatNewPassword: string;
}
