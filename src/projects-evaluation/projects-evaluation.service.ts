import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsEvaluationEntity } from './projects-evaluation.entity';

@Injectable()
export class ProjectsEvaluationService {
  constructor(
    @InjectRepository(ProjectsEvaluationEntity)
    private projectsEvaluationRepository: Repository<ProjectsEvaluationEntity>,
  ) {}

  async create(
    userId,
    courseCompletion,
    courseEngagement,
    projectDegree,
    teamProjectDegree,
  ): Promise<ProjectsEvaluationEntity> {
    return await this.projectsEvaluationRepository.save({
      userId,
      courseCompletion,
      courseEngagement,
      projectDegree,
      teamProjectDegree,
    });
  }
}
