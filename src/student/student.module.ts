import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import {UserModule} from "../user/user.module";
import {HttpModule} from "@nestjs/axios";
import {GithubNameValidator} from "../utils/githubNameValidator";
import {ProjectModule} from "../project/project.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([StudentEntity]),
      forwardRef(() => UserModule),
      forwardRef(() => HttpModule),
      forwardRef(() => ProjectModule)],
  controllers: [StudentController],
  providers: [StudentService, GithubNameValidator],
  exports: [StudentService],
})
export class StudentModule {}
