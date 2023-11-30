import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrProfileEntity } from './hrProfile.entity';
import { HrProfileService } from './hrProfile.service';

@Module({
  imports: [TypeOrmModule.forFeature([HrProfileEntity])],
  providers: [HrProfileService],
  exports: [HrProfileService],
})
export class HrProfileModule {}
