import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentListQuery } from './dto/student.list-query';
import { StudentList } from './dto/student.list';
import { messages } from 'src/config/messages';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/')
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
}
