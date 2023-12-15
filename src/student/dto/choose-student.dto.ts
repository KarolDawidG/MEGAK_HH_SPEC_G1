import { IsString, IsUUID } from 'class-validator';

export class ChooseStudentDto {
  @IsUUID()
  @IsString()
  studentId: string;
}
