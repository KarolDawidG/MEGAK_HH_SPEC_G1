import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserChangePasswordDto } from './dto/user.change-password.dto';
import { messages } from '../config/messages';
import { UserNewPasswordDto } from './dto/user.new-password.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { UserEntity } from './user.entity';
import { roleEnum } from '../interfaces/UserInterface';
import { UserAddHrDto } from './dto/user.add-hr.dto';
import { AddHrResponse } from '../interfaces/AddHrResponse';
import { UserAddAdminDto } from './dto/user.add-admin.dto';
import { UserChangeSelfPasswordDto } from './dto/user.change-self-password.dto';
import { Response } from 'express';
import { hashPwd } from '../utils/hash-pwd';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import {
  StudentImportFormatInterface,
  StudentsImportResponse,
} from 'src/interfaces/StudentsImportResponse';
import { StudentService } from 'src/student/student.service';
import { HrProfileService } from 'src/hrProfile/hrProfile.service';
import { HrProfileEntity } from 'src/hrProfile/hrProfile.entity';
import { StudentEntity } from 'src/student/student.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly hrProfileService: HrProfileService,
  ) {}

  @Post('change-password')
  async changePassword(@Body() body: UserChangePasswordDto): Promise<void> {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException(messages.emailNotFound);
    }
    if (!user.isActive) {
      throw new BadRequestException(messages.userIsNotActive);
    }
    await this.userService.changePassword(user.email, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-self-password')
  async changeSelfPassword(
    @Body() body: UserChangeSelfPasswordDto,
    @UserObj() user: UserEntity,
    @Res() res: Response,
  ): Promise<void> {
    const passHash = hashPwd(body.password);
    const newPassHash = hashPwd(body.newPassword);
    const repNewPasswordHash = hashPwd(body.repeatNewPassword);
    if (newPassHash === user.pwdHash) {
      throw new BadRequestException(messages.newPasswordMustBeDifferent);
    }
    if (newPassHash !== repNewPasswordHash) {
      throw new BadRequestException(messages.passwordsMustBeTheSame);
    }
    if (passHash !== user.pwdHash) {
      throw new BadRequestException(messages.invalidPassword);
    }

    await this.userService.changeSelfPassword(user, body.newPassword, res);
  }

  @Post('new-password')
  async newPassword(@Body() body: UserNewPasswordDto): Promise<void> {
    const user = await this.userService.findById(body.id);
    if (!user) {
      throw new BadRequestException(messages.userIdNotFound);
    }
    if (!user.isActive) {
      throw new BadRequestException(messages.userIsNotActive);
    }
    if (user.token !== body.token || user.id !== body.id) {
      throw new BadRequestException(messages.newPasswordInvalidBody);
    }
    await this.userService.newPassword(user.id, user.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('import')
  async import(
    @Body() body: StudentImportFormatInterface[],
    @UserObj() user: UserEntity,
  ): Promise<StudentsImportResponse> {
    if (user.role !== roleEnum.admin) {
      throw new ForbiddenException(messages.accessDenied);
    }
    const emailList = await this.userService.getEmailsOfAllUsers();

    return await this.userService.studentsImport(body, emailList);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-hr')
  async addHr(
    @Body() body: UserAddHrDto,
    @UserObj() user: UserEntity,
  ): Promise<AddHrResponse> {
    if (user.role !== roleEnum.admin) {
      throw new ForbiddenException(messages.accessDenied);
    }
    const supposedUser = await this.userService.findByEmail(body.email);
    if (supposedUser) {
      throw new BadRequestException(messages.addUserEmailExist);
    }
    return await this.userService.addHr(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-admin')
  async addAdmin(
    @Body() body: UserAddAdminDto,
    @UserObj() user: UserEntity,
  ): Promise<UserEntity> {
    if (user.role !== roleEnum.admin) {
      throw new ForbiddenException(messages.accessDenied);
    }
    const supposedUser = await this.userService.findByEmail(body.email);
    if (supposedUser) {
      throw new BadRequestException(messages.addUserEmailExist);
    }
    return await this.userService.addAdmin(body.email);
  }

  @Post('register')
  async register(@Body() body: UserNewPasswordDto): Promise<void> {
    const user = await this.userService.findById(body.id);
    if (!user) {
      throw new BadRequestException(messages.userIdNotFound);
    }
    if (user.isActive) {
      throw new BadRequestException(messages.userIsActiveError);
    }
    if (user.token !== body.token || user.id !== body.id) {
      throw new BadRequestException(messages.registrationInvalidBody);
    }
    return await this.userService.register(user, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(
    @UserObj() user: UserEntity,
  ): Promise<StudentEntity | HrProfileEntity> {
    try {
      switch (user.role) {
        case roleEnum.student:
          return await this.studentService.findStudentByUserId(user.id);
        case roleEnum.hr:
          return await this.hrProfileService.find(user.id);
        default:
          throw new NotFoundException(messages.userIdNotFound);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
