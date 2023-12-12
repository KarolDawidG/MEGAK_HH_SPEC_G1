import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrProfileEntity } from './hrProfile.entity';
import { HrProfileService } from './hrProfile.service';
import { HrProfileController } from './hrProfile.controller';
import { StudentModule } from '../student/student.module';
import { ConversationModule } from '../conversation/conversation.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HrProfileEntity]),
    forwardRef(() => StudentModule),
    forwardRef(() => ConversationModule),
    forwardRef(() => UserModule),
  ],
  controllers: [HrProfileController],
  providers: [HrProfileService],
  exports: [HrProfileService],
})
export class HrProfileModule {}
