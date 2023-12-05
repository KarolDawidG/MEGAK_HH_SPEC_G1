import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HrProfileEntity } from './hrProfile.entity';

@Injectable()
export class HrProfileService {
  constructor(
    @InjectRepository(HrProfileEntity)
    private hrProfileRepository: Repository<HrProfileEntity>,
  ) {}

  async create(
    userId,
    companyName,
    fullName,
    maxReservedStudents,
  ): Promise<HrProfileEntity> {
    return await this.hrProfileRepository.save({
      userId,
      companyName,
      fullName,
      maxReservedStudents,
    });
  }
}
