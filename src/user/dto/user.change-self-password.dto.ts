import { IsString } from 'class-validator';

export class UserChangeSelfPasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;

  @IsString()
  repeatNewPassword: string;
}
