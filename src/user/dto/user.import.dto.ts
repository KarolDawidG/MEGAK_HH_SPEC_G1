import { IsJSON } from 'class-validator';

export class UserImportDto {
  @IsJSON()
  jsonData: string;
}
