import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { StudentModule } from './student/student.module';
import { HrProfileModule } from './hrProfile/hrProfile.module';
import { ProjectModule } from './project/project.module';
import { ProjectsEvaluationModule } from './projects-evaluation/projects-evaluation.module';
import { ConversationModule } from './conversation/conversation.module';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.dbHost,
      port: 3306,
      username: config.dbUser,
     // password: config.dbPassword,
      database: config.dbDatabase,
      entities: ['dist/**/**.entity{.ts,.js}'],
      bigNumberStrings: false,
      logging: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    MailModule,
    StudentModule,
    HrProfileModule,
    ProjectModule,
    ProjectsEvaluationModule,
    ConversationModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
