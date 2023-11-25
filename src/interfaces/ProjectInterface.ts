export enum ProjectTypeEnum {
  bonusProject = 0,
  portfolio = 1,
  teamProject = 2,
}

export interface ProjectInterface {
  id: string;
  userId: string;
  url: string;
  type: ProjectTypeEnum;
  createdAt: string;
  updatedAt: string;
}
