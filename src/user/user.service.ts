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
import {
  StudentImportFormatInterface,
  StudentsImportResponse,
} from '../interfaces/StudentsImportResponse';
import { roleEnum } from '../interfaces/UserInterface';
import { ProjectsEvaluationService } from '../projects-evaluation/projects-evaluation.service';
import { ProjectService } from '../project/project.service';
import { HrProfileService } from '../hrProfile/hrProfile.service';
import { UserAddHrDto } from './dto/user.add-hr.dto';
import { AddHrResponse } from '../interfaces/AddHrResponse';
import { hrCreatedEmailTemplate } from '../templates/email/hrCreated';
import { adminCreatedEmailTemplate } from '../templates/email/adminCreated';
import { registrationSuccessEmailTemplate } from '../templates/email/registrationSuccess';
import { changePasswordEmailTemplate } from '../templates/email/changePassword';
import { newPasswordEmailTemplate } from '../templates/email/newPassword';
import { StudentService } from '../student/student.service';
import { StudentsImportJsonInterface } from '../interfaces/StudentsImportJsonInterface';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { validate } from 'class-validator';
import { UserValidator } from '../utils/userValidator';
import { projectTypeEnum } from 'src/interfaces/ProjectInterface';
import { studentCreatedEmailTemplate } from 'src/templates/email/studentCreated';

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
    @Inject(StudentService)
    private studentService: StudentService,
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({ where: { id } });
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
        changePasswordEmailTemplate(token, id),
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async changeSelfPassword(
    user: UserEntity,
    newPassword: string,
    res: Response,
  ) {
    try {
      await this.newPassword(user.id, user.email, newPassword);
      await this.authService.logout(user, res);
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
        newPasswordEmailTemplate(),
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async studentsImport(
    data: UserValidator[],
    emailList,
  ): Promise<StudentsImportResponse> {
    try {
      const approved: StudentImportFormatInterface[] = [];
      const rejected: StudentsImportJsonInterface[] = [];
      data.forEach(async (student) => {
        const obj = new UserValidator(student);

        if (emailList.includes(student.email)) {
          rejected.push({
            ...student,
            message: messages.errors.userImport.EmailAlreadyExists,
          });
          return;
        }

        const errors = await validate(obj, {
          validationError: {
            value: false,
          },
          stopAtFirstError: true,
        });

        if (errors.length) {
          rejected.push({
            ...student,
            message: errors
              .map((val) => Object.values(val.constraints))
              .join(' '),
          });
          return;
        }

        approved.push(student);
        const token = uuid();
        // const user = await this.userRepository.save({
        //   email: student.email,
        //   role: roleEnum.student,
        //   pwdHash: '',
        //   isActive: false,
        //   token,
        // });

        // await this.projectsEvaluationService.create(
        //   user.id,
        //   student.courseCompletion,
        //   student.courseEngagement,
        //   student.projectDegree,
        //   student.teamProjectDegree,
        // );

        // await student.bonusProjectUrls.forEach(async (URL) => {
        //   await this.projectService.create(
        //     user.id,
        //     URL.replace(/[\[\]]/g, ''),
        //     projectTypeEnum.portfolio,
        //   );
        // });

        //   await this.mailService.sendMail(
        //     user.email,
        //     messages.newStudentSubject,
        //     studentCreatedEmailTemplate(user.token, user.id),
        //   );
      });

      return {
        approved,
        rejected,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.messages);
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
        pwdHash: '',
      });
      const hrProfile = await this.hrProfileService.create(
        user.id,
        userHrDto.company,
        userHrDto.fullName,
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
        pwdHash: '',
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

  async register(user: UserEntity, password: string): Promise<void> {
    try {
      const pwdHash = hashPwd(password);
      await this.userRepository.update(user.id, {
        pwdHash,
        token: '',
        isActive: true,
        registeredAt: () => 'CURRENT_TIMESTAMP',
      });
      if (user.role === roleEnum.student) {
        await this.studentService.create(user.id);
      }
      await this.mailService.sendMail(
        user.email,
        messages.userRegisteredSubject,
        registrationSuccessEmailTemplate(),
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
