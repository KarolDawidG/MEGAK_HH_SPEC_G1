export interface StudentImportFormatInterface {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string;
}

export interface StudentsImportResponse {
  approved: StudentImportFormatInterface[];
  rejected: string[];
}
