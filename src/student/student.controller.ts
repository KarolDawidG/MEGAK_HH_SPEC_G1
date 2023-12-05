import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards, BadRequestException
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
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

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  // @UsePipes(
  //   new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }), // @TODO: Seems to deosn't work
  // )
  async getList(
    @Query() filterOptions: StudentListQuery,
  ): Promise<[StudentList[], number]> {
    const searchResult = await this.studentService.findAll(filterOptions);

    if (!searchResult.length) {
      throw new NotFoundException(messages.emptySearchResult);
    }

    return searchResult;
  }

  @Get('/student-profile/:id')
  @UseGuards(AuthGuard('jwt'))
  async findStudentProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentProfileResponse> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(messages.userIdNotFound);
    }
    const userProfile = await this.studentService.findOne(user.id);
    if (!userProfile.studentDetails) {
      throw new NotFoundException(messages.studentIdNotFound);
    }
    return userProfile;
  }

  // @Patch('/student-profile/:id')
  // @UseGuards(AuthGuard('jwt'))
  // async updateStudentProfile(
  //   @Param('id', ParseUUIDPipe) studentId: string,
  //   @Body() studentProfileDetails: UpdateStudentDetailsDto,
  // ): Promise<UpdatedStudentResponse> {
  //   return this.studentService.updateOne(studentId, studentProfileDetails);
  // }
}
