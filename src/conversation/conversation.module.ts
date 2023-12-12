import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './conversation.entity';
import { ConversationService } from './conversation.service';
import { StudentModule } from '../student/student.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity]),
    forwardRef(() => StudentModule),
    forwardRef(() => UserModule),
  ],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
