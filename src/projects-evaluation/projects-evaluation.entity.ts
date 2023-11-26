import { ProjectsEvaluationInterface } from 'src/interfaces/ProjectsEvaluationInterface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'projects_evaluations',
})
export class ProjectsEvaluationEntity implements ProjectsEvaluationInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'USER_ID', type: 'varchar', length: 36, unique: true })
  userId: string;

  @Column({ name: 'COURSE_COMPLETION', type: 'boolean' })
  courseCompletion: boolean;

  @Column({ name: 'COURSE_ENGAGEMENT', type: 'tinyint' })
  courseEngagement: number;

  @Column({ name: 'PROJECT_DEGREE', type: 'tinyint' })
  projectDegree: number;

  @Column({ name: 'TEAM_PROEJCT_DEGREE', type: 'tinyint' })
  teamProjectDegree: number;

  @Column({
    name: 'CREATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Column({
    name: 'UPDATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
