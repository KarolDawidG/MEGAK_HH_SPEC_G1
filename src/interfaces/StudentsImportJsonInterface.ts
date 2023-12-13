export interface StudentsImportJsonInterface {
  email: string;
  courseCompletion: string | number;
  courseEngagement: string | number;
  projectDegree: string | number;
  teamProjectDegree: string | number;
  bonusProjectUrls: string;
  message?: string;
}
