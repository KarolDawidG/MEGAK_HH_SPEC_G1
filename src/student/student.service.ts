import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from './student.entity';
import { studentStatus } from '../interfaces/StudentInterface';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
  ) {}

  async create(userId): Promise<StudentEntity> {
    try {
      return await this.studentRepository.save({
        userId,
        status: studentStatus.available,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
