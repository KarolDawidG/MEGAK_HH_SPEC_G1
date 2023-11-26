import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrProfileEntity } from './hrProfile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HrProfileEntity])],
})
export class HrProfileModule {}
