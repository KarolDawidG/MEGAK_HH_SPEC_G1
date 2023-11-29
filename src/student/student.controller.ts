import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentListQuery } from './dto/student.list-query';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/')
  @UsePipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }),
  )
  async getList(@Query() filterOptions: StudentListQuery): Promise<any> {
    // Change Return Type
    return await this.studentService.findAll(filterOptions);
  }
}
