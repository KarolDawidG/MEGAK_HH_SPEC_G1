export enum workTypeEnum {
  noPreferences = 'Bez znaczenia',
  onSite = 'Na miejscu',
  relocation = 'Gotowość do przeprowadzki',
  remote = 'Wyłącznie zdalnie',
  hybrid = 'Hybrydowo',
}

export enum contractTypeEnum {
  noPreferences = 'Brak preferencji',
  UoP = 'Tylko UoP',
  B2B = 'Możliwe B2B',
  UZorUoD = 'Możliwe UZ/UOD',
}

export enum studentStatus {
  available = 0,
  duringConversation = 1,
  engaged = 2,
}

export interface StudentInterface {
  id: string;
  //userId: string;
  status: studentStatus;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  githubName: string | null;
  bio: string;
  expectedWorkType: workTypeEnum;
  targetWorkCity: string;
  expectedContractType: contractTypeEnum;
  expectedSalary: number | null;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExperience: number;
  education: string;
  workExperience: string;
  courses: string;
  createdAt: string;
  updatedAt: string;
}


export type StudentDetails = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  githubName: string | null;
  bio: string;
  expectedWorkType: workTypeEnum;
  targetWorkCity: string;
  expectedContractType: contractTypeEnum;
  expectedSalary: number | null;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExperience: number;
  education: string;
  workExperience: string;
  courses: string;
}

export interface StudentProfileResponse{
  studentDetails: StudentDetails;
}

export interface githubNameValidatorResponse {
  isGithubUser: boolean,
  isGithubUserUnique: boolean,
}

export type UpdatedStudentResponse = {
  isSuccess: boolean;

}
