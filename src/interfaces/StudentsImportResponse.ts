import { StudentsImportJsonInterface } from './StudentsImportJsonInterface';

export interface StudentImportFormatInterface {
  email: string;
  courseCompletion: string | number;
  courseEngagement: string | number;
  projectDegree: string | number;
  teamProjectDegree: string | number;
  bonusProjectUrls: string;
}

export interface StudentsImportResponse {
  approved: StudentImportFormatInterface[];
  rejected: StudentsImportJsonInterface[];
}
