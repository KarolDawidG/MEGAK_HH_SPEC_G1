export enum userRoleEnum {
  student = 0,
  hr = 1,
  admin = 2,
}

export interface UserInterface {
  id: string;
  userName: string;
  pwdHash: string;
  email: string;
  isActive: boolean;
  userRole: userRoleEnum;
  createdAt: string;
  currentToken: string;
  registerToken: string;
}
