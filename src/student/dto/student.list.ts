import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';
import {
  workTypeEnum,
  contractTypeEnum,
} from 'src/interfaces/StudentInterface';
import { StudentListResponse } from 'src/interfaces/StudentListResponse';

export class StudentList implements StudentListResponse {
  @IsUUID('4')
  @IsString()
  studentId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  expectedWorkType: workTypeEnum;

  @IsString()
  targetWorkCity: string;

  @IsNumber()
  expectedContractType: contractTypeEnum;

  @IsNumber()
  expectedSalary: number;

  @IsBoolean()
  canTakeApprenticeship: boolean;

  @IsNumber()
  monthsOfCommercialExperiecne: number;

  @IsNumber()
  projectDegree: number;

  @IsNumber()
  teamProjectDegree: number;

  @IsNumber()
  courseCompletion: number;

  @IsNumber()
  courseEngagement: number;
}
