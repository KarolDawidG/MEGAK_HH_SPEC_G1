import { IsOptional, IsString } from 'class-validator';

export class ConversationListQuery {
  @IsOptional()
  @IsString()
  srch: string;
}
