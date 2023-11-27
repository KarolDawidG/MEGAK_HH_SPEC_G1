import { IsString } from 'class-validator';

export class UserImportDto {
  @IsString()
  path: string;
}
