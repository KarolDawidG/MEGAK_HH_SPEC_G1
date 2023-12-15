import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    userId: string,
    companyName: string,
    fullName: string,
    maxReservedStudents: number,
  ): Promise<HrProfileEntity> {
    try {
      return await this.hrProfileRepository.save({
        userId,
        companyName,
        fullName,
        maxReservedStudents,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async find(userId: string): Promise<HrProfileEntity> {
    try {
      return await this.hrProfileRepository.findOne({ where: { userId } });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
