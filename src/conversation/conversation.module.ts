import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity])],
})
export class ConversationModule {}
