export enum workTypeEnum {
  noPreferences = 0,
  onSite = 1,
  relocation = 2,
  remote = 3,
  hybrid = 4,
}

export enum contractTypeEnum {
  noPreferences = 0,
  UoP = 1,
  B2B = 2,
  UZorUoD = 3,
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
  updatedAt: () => string;
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
