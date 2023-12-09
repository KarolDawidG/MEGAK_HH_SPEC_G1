import {
    Body,
    Controller,
    forwardRef,
    Get,
    NotFoundException,
    Query,
    Inject,
    Param,
    ParseUUIDPipe,
    Patch,
    UseGuards,
    BadRequestException,
    NotAcceptableException,
} from '@nestjs/common';
//import {AuthGuard} from "@nestjs/passport";
import {StudentService} from "./student.service";
import {StudentListQuery} from './dto/student.list-query';
import {StudentList} from './dto/student.list';
import {messages} from 'src/config/messages';
import {StudentProfileResponse, UpdatedStudentResponse} from "../interfaces/StudentInterface";
import {UpdateStudentDetailsDto} from "./dto/update-student-details.dto";
import {UserService} from "../user/user.service";
import {roleEnum} from "../interfaces/UserInterface";
import { JwtAuthGuard } from '../guards/jwt.auth.guard';


@Controller('student')
export class StudentController {
  constructor(
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  // @UsePipes(
  //   new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }), // @TODO: Seems to deosn't work
  // )
  async getList(
    @Query() filterOptions: StudentListQuery,
  ): Promise<[StudentList[], number]> {
    const searchResult = await this.studentService.findAll(filterOptions);

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
        const userProfile = await this.studentService.findOne(user.id);
        if (!userProfile.studentDetails) {
            throw new NotFoundException(messages.studentIdNotFound);
        }
        return userProfile;
    }


    @Patch('/student-profile/:id')
    @UseGuards(JwtAuthGuard)
    async updateStudentProfile(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() studentProfileDetails: UpdateStudentDetailsDto
    ): Promise<UpdatedStudentResponse> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException(messages.userIdNotFound);
        }
        if (!user.email) {
            throw new BadRequestException(messages.emailNotFound);
        }
        if (!user.isActive) {
            throw new NotAcceptableException(messages.notActiveUserError);
        }
        if(!(user.role===roleEnum.student)){
            throw new NotAcceptableException(messages.notAcceptableRoleError);
        }

        const student = await this.studentService.findStudentByUserId(user.id);
        if (!student) {
            throw new NotFoundException(messages.studentIdNotFound);
        }

        return this.studentService.updateOne(student, studentProfileDetails);
    }

}
