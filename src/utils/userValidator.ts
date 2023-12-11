import { Transform, Type } from 'class-transformer';
import { Contains, IsEmail, IsString, IsUrl } from 'class-validator';
import { messages } from 'src/config/messages';
import { StudentsImportJsonInterface } from 'src/interfaces/StudentsImportJsonInterface';
import { IsDegreeValid } from 'src/utils/degreeValidator';

export class UserValidator
  implements
    Omit<
      StudentsImportJsonInterface,
      'message' | 'bonusProjectUrls' | 'teamProjectDegree'
    >
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

  @Transform(({ value }) => Number(value))
  @IsDegreeValid(
    { min: 1, max: 5 },
    { message: messages.errors.userImport.InvalidCompletionDegree },
  )
  courseCompletion: number | string;

  @Transform(({ value }) => Number(value))
  @IsDegreeValid(
    { min: 1, max: 5 },
    { message: messages.errors.userImport.InvalidEngagementDegree },
  )
  courseEngagement: number | string;

  @Transform(({ value }) => Number(value))
  @IsDegreeValid(
    { min: 1, max: 5 },
    { message: messages.errors.userImport.InvalidProjectDegree },
  )
  projectDegree: number | string;

  @Transform(({ value }) => Number(value))
  @IsDegreeValid(
    { min: 1, max: 5 },
    { message: messages.errors.userImport.InvalidTeamProjectDegree },
  )
  teamProjectDegree: number | string;

  @IsString({ each: true, message: 'Wszystkie dane muszą być ciągami teksu!' })
  @Contains('https://github.com', {
    each: true,
    message: messages.errors.userImport.InvalidProjectLink,
  })
  @IsUrl(
    { require_host: true, host_whitelist: ['github.com'] },
    { message: messages.errors.userImport.InvalidProjectLink, each: true },
  )
  bonusProjectUrls: string[];
}
