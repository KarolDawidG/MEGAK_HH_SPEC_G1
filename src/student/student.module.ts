import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../project/project.entity';
import { GithubNameValidator } from '../utils/githubNameValidator';

@Module({
  exports: [StudentService],
  imports: [
    TypeOrmModule.forFeature([StudentEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([ProjectEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => HttpModule),
  ],
  controllers: [StudentController],
  providers: [StudentService, GithubNameValidator],
})
export class StudentModule {}
