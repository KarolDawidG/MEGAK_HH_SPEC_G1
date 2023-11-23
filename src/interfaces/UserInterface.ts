export enum roleEnum {
  student = 0,
  hr = 1,
  admin = 2,
}

export interface UserInterface {
  id: string;
  pwdHash: string;
  email: string;
  isActive: boolean;
  role: roleEnum;
  createdAt: string;
  registeredAt: string;
  token: string;
}
