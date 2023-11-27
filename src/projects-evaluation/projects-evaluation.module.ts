import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsEvaluationEntity } from './projects-evaluation.entity';
import { ProjectsEvaluationService } from './projects-evaluation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsEvaluationEntity])],
  providers: [ProjectsEvaluationService],
  exports: [ProjectsEvaluationService],
})
export class ProjectsEvaluationModule {}
