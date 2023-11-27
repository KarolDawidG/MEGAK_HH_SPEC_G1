import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { messages } from '../config/messages';
import { hashPwd } from '../utils/hash-pwd';
import * as papa from 'papaparse';
import * as fs from 'fs';
import { isEmailValid } from '../utils/isEmailValid';
import { isDegreeValid } from '../utils/isDegreeValid';
import {
  StudentImportFormatInterface,
  StudentsImportResponse,
} from '../interfaces/StudentsImportResponse';
import { roleEnum } from '../interfaces/UserInterface';
import { ProjectsEvaluationService } from '../projects-evaluation/projects-evaluation.service';
import { ProjectService } from '../project/project.service';
import { projectTypeEnum } from '../interfaces/ProjectInterface';
import { studentCreatedEmailTemplate } from '../templates/email/studentCreated';
import { HrProfileService } from '../hrProfile/hrProfile.service';
import { UserAddHrDto } from './dto/user.add-hr.dto';
import { AddHrResponse } from '../interfaces/AddHrResponse';
import { hrCreatedEmailTemplate } from '../templates/email/hrCreated';
import { adminCreatedEmailTemplate } from '../templates/email/adminCreated';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(MailService)
    private mailService: MailService,
    @Inject(ProjectsEvaluationService)
    private projectsEvaluationService: ProjectsEvaluationService,
    @Inject(ProjectService)
    private projectService: ProjectService,
    @Inject(HrProfileService)
    private hrProfileService: HrProfileService,
  ) {}

  async findOne(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getEmailsOfAllUsers(): Promise<string[]> {
    try {
      const userEmails = await this.userRepository.find({ select: ['email'] });
      return userEmails.map((user) => user.email);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async changePassword(email: string, id: string): Promise<void> {
    try {
      const token = uuid();
      await this.userRepository.update(id, { token });
      await this.mailService.sendMail(
        email,
        messages.changePasswordSubject,
        messages.changePasswordHtml + id + '/' + token,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async newPassword(
    id: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      const pwdHash = hashPwd(password);
      await this.userRepository.update(id, { pwdHash, token: '' });
      await this.mailService.sendMail(
        email,
        messages.newPasswordSubject,
        messages.newPasswordHtml,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async studentsImport(filePath, emailList): Promise<StudentsImportResponse> {
    try {
      const fileStream = fs.createReadStream(filePath);
      const parsedData: any[] = await new Promise((resolve, reject) => {
        fileStream.on('error', (error) => {
          reject(error);
        });

        papa.parse(fileStream, {
          complete: (results) => {
            resolve(results.data);
          },
          error: (error) => {
            reject(error);
          },
        });
      });
      const approved: StudentImportFormatInterface[] = [];
      const rejected: string[] = [];
      parsedData.map((student) => {
        if (!isEmailValid(student[0])) {
          student.unshift(messages.csvImportEmailValidationError);
          rejected.push(student);
        } else if (emailList.includes(student[0])) {
          student.unshift(messages.csvImportEmailExistError);
          rejected.push(student);
        } else if (!isDegreeValid(Number(student[1]))) {
          student.unshift(messages.csvImportCompletionDegreeValidationError);
          rejected.push(student);
        } else if (!isDegreeValid(Number(student[2]))) {
          student.unshift(messages.csvImportEngagementDegreeValidationError);
          rejected.push(student);
        } else if (!isDegreeValid(Number(student[3]))) {
          student.unshift(messages.csvImportProjectDegreeValidationError);
          rejected.push(student);
        } else if (!isDegreeValid(Number(student[4]))) {
          student.unshift(messages.csvImportTeamProjectDegreeValidationError);
          rejected.push(student);
        } else {
          approved.push({
            email: student[0],
            courseCompletion: Number(student[1]),
            courseEngagement: Number(student[2]),
            projectDegree: Number(student[3]),
            teamProjectDegree: Number(student[4]),
            bonusProjectUrls: student[5],
          });
        }
      });
      for (const student of approved) {
        const token = uuid();
        const user = await this.userRepository.save({
          email: student.email,
          role: roleEnum.student,
          isActive: false,
          token,
        });
        await this.projectsEvaluationService.create(
          user.id,
          student.courseCompletion,
          student.courseEngagement,
          student.projectDegree,
          student.teamProjectDegree,
        );
        const projectUrls = student.bonusProjectUrls
          .replace(`/[\"\[\]]/g`, '')
          .split(',');
        for (const url of projectUrls) {
          if (url.includes('github.com')) {
            await this.projectService.create(
              user.id,
              url,
              projectTypeEnum.portfolio,
            );
          }
        }
        await this.mailService.sendMail(
          user.email,
          messages.newStudentSubject,
          studentCreatedEmailTemplate(user.token, user.id),
        );
      }
      return {
        approved,
        rejected,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addHr(userHrDto: UserAddHrDto): Promise<AddHrResponse> {
    try {
      const token = uuid();
      const user = await this.userRepository.save({
        email: userHrDto.email,
        token,
        isActive: false,
        role: roleEnum.hr,
      });
      const hrProfile = await this.hrProfileService.create(
        user.id,
        userHrDto.company,
        userHrDto.firstName,
        userHrDto.lastName,
        userHrDto.maxReservedStudents,
      );
      await this.mailService.sendMail(
        user.email,
        messages.newHrSubject,
        hrCreatedEmailTemplate(user.token, user.id),
      );
      return { user, hrProfile };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async addAdmin(email: string): Promise<UserEntity> {
    try {
      const token = uuid();
      const user = await this.userRepository.save({
        email,
        token,
        isActive: false,
        role: roleEnum.admin,
      });
      await this.mailService.sendMail(
        user.email,
        messages.newAdminSubject,
        adminCreatedEmailTemplate(user.token, user.id),
      );
      return user;
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
