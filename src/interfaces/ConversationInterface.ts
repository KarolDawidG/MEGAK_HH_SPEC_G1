export enum ConversationStatusEnum {
  scheduled = 0,
  completed = 1,
  canceled = 2,
}

export interface ConversationInterface {
  id: string;
  hrProfileId: string;
  studentId: string;
  status: ConversationStatusEnum;
  createdAt: string;
  updatedAt: string;
}
