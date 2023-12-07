import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { ProjectsEvaluationModule } from '../projects-evaluation/projects-evaluation.module';
import { ProjectModule } from '../project/project.module';
import { HrProfileModule } from '../hrProfile/hrProfile.module';
import { StudentModule } from '../student/student.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => MailModule),
    forwardRef(() => ProjectsEvaluationModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => HrProfileModule),
    forwardRef(() => StudentModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
