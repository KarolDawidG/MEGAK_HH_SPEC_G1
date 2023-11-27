import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserChangePasswordDto } from './dto/user.change-password.dto';
import { messages } from '../config/messages';
import { UserNewPasswordDto } from './dto/user.new-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserImportDto } from './dto/user.import.dto';
import { StudentsImportResponse } from '../interfaces/StudentsImportResponse';
import { UserObj } from '../decorators/user-obj.decorator';
import { UserEntity } from './user.entity';
import { roleEnum } from '../interfaces/UserInterface';
import { UserAddHrDto } from './dto/user.add-hr.dto';
import { AddHrResponse } from '../interfaces/AddHrResponse';
import { UserAddAdminDto } from './dto/user.add-admin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-password')
  async changePassword(@Body() body: UserChangePasswordDto): Promise<void> {
    const user = await this.userService.findOne(body.email);
    if (!user) {
      throw new BadRequestException(messages.emailNotFound);
    }
    if (!user.isActive) {
      throw new BadRequestException(messages.userIsNotActive);
    }
    await this.userService.changePassword(user.email, user.id);
  }

  @Post('new-password')
  async newPassword(@Body() body: UserNewPasswordDto): Promise<void> {
    const user = await this.userService.findOne(body.email);
    if (!user) {
      throw new BadRequestException(messages.emailNotFound);
    }
    if (!user.isActive) {
      throw new BadRequestException(messages.userIsNotActive);
    }
    if (user.token !== body.token || user.id !== body.id) {
      throw new BadRequestException(messages.newPasswordInvalidBody);
    }
    await this.userService.newPassword(user.id, user.email, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('import')
  async import(
    @Body() body: UserImportDto,
    @UserObj() user: UserEntity,
  ): Promise<StudentsImportResponse> {
    if (user.role !== roleEnum.admin) {
      throw new ForbiddenException(messages.accessDenied);
    }
    const emailList = await this.userService.getEmailsOfAllUsers();
    return await this.userService.studentsImport(body.path, emailList);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-hr')
  async addHr(
    @Body() body: UserAddHrDto,
    @UserObj() user: UserEntity,
  ): Promise<AddHrResponse> {
    if (user.role !== roleEnum.admin) {
      throw new ForbiddenException(messages.accessDenied);
    }
    const supposedUser = await this.userService.findOne(body.email);
    if (supposedUser) {
      throw new BadRequestException(messages.addUserEmailExist);
    }
    return await this.userService.addHr(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-admin')
  async addAdmin(
    @Body() body: UserAddAdminDto,
    @UserObj() user: UserEntity,
  ): Promise<UserEntity> {
    if (user.role !== roleEnum.admin) {
      throw new ForbiddenException(messages.accessDenied);
    }
    const supposedUser = await this.userService.findOne(body.email);
    if (supposedUser) {
      throw new BadRequestException(messages.addUserEmailExist);
    }
    return await this.userService.addAdmin(body.email);
  }

  @Post('register')
  async register(@Body() body: UserNewPasswordDto): Promise<void> {
    const user = await this.userService.findOne(body.email);
    if (!user) {
      throw new BadRequestException(messages.emailNotFound);
    }
    if (user.isActive) {
      throw new BadRequestException(messages.userIsActiveError);
    }
    if (user.token !== body.token || user.id !== body.id) {
      throw new BadRequestException(messages.registrationInvalidBody);
    }
    return await this.userService.register(user, body.password);
  }
}
