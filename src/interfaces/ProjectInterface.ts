export enum projectTypeEnum {
  bonusProject = 0,
  portfolio = 1,
}

export interface ProjectInterface {
  id: string;
  userId: string;
  url: string;
  type: projectTypeEnum;
  createdAt: string;
  updatedAt: string;
}
