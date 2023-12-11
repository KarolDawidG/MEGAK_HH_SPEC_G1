import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './conversation.entity';
import { ConversationService } from './conversation.service';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity]),
    forwardRef(() => StudentModule),
  ],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
