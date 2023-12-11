import { IsString, IsUUID } from 'class-validator';

export class ChooseStudentDto {
  @IsUUID('4')
  @IsString()
  studentId: string;
}
