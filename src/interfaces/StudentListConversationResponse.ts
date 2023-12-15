import { StudentListResponse } from './StudentListResponse';

export interface StudentListConversationResponse extends StudentListResponse {
  reservedTo: Date;
  githubUserName: string;
}
