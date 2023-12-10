import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { messages } from 'src/config/messages';
import { StudentsImportJsonInterface } from 'src/interfaces/StudentsImportJsonInterface';

export class UserValidator
  implements Omit<StudentsImportJsonInterface, 'message'>
{
  constructor(data: UserValidator) {
    this.email = data.email;
    this.courseCompletion = data.courseCompletion;
    this.courseEngagement = data.courseEngagement;
    this.projectDegree = data.projectDegree;
    this.teamProjectDegree = data.teamProjectDegree;
    this.bonusProjectUrls = data.bonusProjectUrls;
  }

  @IsEmail({}, { message: messages.invalidEmail })
  email: string;

  @Transform((val) => Number(val))
  @IsNumber({}, { message: messages.csvImportCompletionDegreeValidationError })
  @Min(1, { message: messages.csvImportCompletionDegreeValidationError })
  @Max(5, { message: messages.csvImportCompletionDegreeValidationError })
  courseCompletion: number;

  @IsInt({ message: messages.csvImportEngagementDegreeValidationError })
  @Min(1, { message: messages.csvImportEngagementDegreeValidationError })
  @Max(5, { message: messages.csvImportEngagementDegreeValidationError })
  courseEngagement: number;

  @IsNumber({}, { message: messages.csvImportProjectDegreeValidationError })
  @Min(1, { message: messages.csvImportProjectDegreeValidationError })
  @Max(5, { message: messages.csvImportProjectDegreeValidationError })
  projectDegree: number;

  @IsInt({ message: messages.csvImportTeamProjectDegreeValidationError })
  @Min(1, { message: messages.csvImportTeamProjectDegreeValidationError })
  @Max(5, { message: messages.csvImportTeamProjectDegreeValidationError })
  teamProjectDegree: number;

  @IsString({ each: true, message: 'Wszystkie dane muszą być ciągami teksu!' })
  bonusProjectUrls: string[];
}
