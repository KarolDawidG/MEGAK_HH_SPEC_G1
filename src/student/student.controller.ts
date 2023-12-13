import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  BadRequestException,
  NotAcceptableException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentListQuery } from './dto/student.list-query';
import { StudentList } from './dto/student.list';
import { messages } from 'src/config/messages';
import {
  StudentProfileResponse,
  UpdatedStudentResponse,
} from '../interfaces/StudentInterface';
import { UpdateStudentDetailsDto } from './dto/update-student-details.dto';
import { UserService } from '../user/user.service';
import { GithubNameValidator } from '../utils/githubNameValidator';
import { roleEnum } from '../interfaces/UserInterface';
import { UserObj } from '../decorators/user-obj.decorator';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';

@Controller('student')
export class StudentController {
  constructor(
    @Inject(StudentService)
    private readonly studentService: StudentService,
    private readonly userService: UserService,
    private githubService: GithubNameValidator,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getList(
    @Query() filterOptions: StudentListQuery,
  ): Promise<[StudentList[], number]> {
    const searchResult = await this.studentService.findAll(filterOptions);

    if (!searchResult[0].length) {
      throw new NotFoundException(messages.emptySearchResult);
    }

    return searchResult;
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversation-list')
  async getConverstationList(
    @Query() filterOptions: StudentListQuery,
    @UserObj() user: UserEntity,
  ): Promise<[StudentList[], number]> {
    if (user.role < 1) {
      throw new UnauthorizedException(messages.accessDenied);
    }

    const searchResult = await this.studentService.findAll(
      filterOptions,
      true,
      user.id,
    );

    if (!searchResult[0].length) {
      throw new NotFoundException(messages.emptySearchResult);
    }

    return searchResult;
  }

  @Get('/student-profile/:id')
  @UseGuards(JwtAuthGuard)
  async findStudentProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentProfileResponse> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(messages.userIdNotFound);
    }
    if (!user.isActive) {
      throw new NotAcceptableException(messages.userIsNotActive);
    }
    if (!(user.role === roleEnum.student)) {
      throw new NotAcceptableException(messages.notAcceptableRoleError);
    }

    const userProfile = await this.studentService.findOne(user.id);
    if (!userProfile.studentDetails) {
      throw new NotFoundException(messages.studentIdNotFound);
    }
    return userProfile;
  }

  @Patch('/student-profile')
  @UseGuards(JwtAuthGuard)
  async updateStudentProfile(
    @Body() studentProfileDetails: UpdateStudentDetailsDto,
    @UserObj() userStudent: UserEntity,
  ): Promise<UpdatedStudentResponse> {
    const user = await this.userService.findById(userStudent.id);
    if (!user) {
      throw new NotFoundException(messages.userIdNotFound);
    }
    if (!user.email) {
      throw new BadRequestException(messages.emailNotFound);
    }
    if (!user.isActive) {
      throw new NotAcceptableException(messages.notActiveUserError);
    }
    if (!(user.role === roleEnum.student)) {
      throw new NotAcceptableException(messages.notAcceptableRoleError);
    }

    const student = await this.studentService.findStudentByUserId(user.id);
    if (!student) {
      throw new NotFoundException(messages.studentIdNotFound);
    }

    const { githubName, email } = studentProfileDetails;
    if (githubName) {
      const { isGithubUser, isGithubUserUnique } =
        await this.githubService.validateGithubName(student.id, githubName);
      if (!isGithubUserUnique) {
        throw new NotAcceptableException(messages.updatedGithubNamExist);
      }
      if (!isGithubUser) {
        throw new NotFoundException(messages.githubUsernameNotFound);
      }
    }
    if (email) {
      const userWithEmail = await this.userService.findByEmail(email);
      if (!!userWithEmail && userWithEmail.id !== userStudent.id) {
        throw new NotAcceptableException(messages.updatedUserEmailExist);
      }
    }

    return this.studentService.updateOne(student, studentProfileDetails);
  }
}
