import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEvaluationEntity } from './projects-evaluation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsEvaluationEntity])],
})
export class ProjectsEvaluationModule {}
