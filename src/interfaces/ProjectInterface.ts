export enum projectTypeEnum {
  bonusProject = 0,
  portfolio = 1,
  teamProject = 2,
}

export interface ProjectInterface {
  id: string;
  userId: string;
  url: string;
  type: projectTypeEnum;
  createdAt: string;
  updatedAt: string;
}
