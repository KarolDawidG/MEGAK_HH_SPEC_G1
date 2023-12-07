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
} from '@nestjs/common';
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

@Controller('student')
export class StudentController {
  constructor(
    @Inject(forwardRef(() => StudentService))
    private readonly studentService: StudentService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
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

  @Get('/student-profile/:id')
  @UseGuards(AuthGuard('jwt'))
  async findStudentProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentProfileResponse> {
    return this.studentService.findOne(id);
  }

  @Patch('/student-profile/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateStudentProfile(
    @Param('id', ParseUUIDPipe) studentId: string,
    @Body() studentProfileDetails: UpdateStudentDetailsDto,
  ): Promise<UpdatedStudentResponse> {
    return this.studentService.updateOne(studentId, studentProfileDetails);
  }
}
