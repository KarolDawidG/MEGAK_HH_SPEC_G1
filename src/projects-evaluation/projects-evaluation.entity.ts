import { ProjectsEvaluationInterface } from 'src/interfaces/ProjectsEvaluationInterface';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'projects_evaluations',
})
export class ProjectsEvaluationEntity implements ProjectsEvaluationInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @OneToOne(() => UserEntity, (user) => user.projectEvaluation)
  @JoinColumn({ name: 'USER_ID' })
  user: UserEntity;

  @Column({ name: 'USER_ID', type: 'varchar', length: 36, unique: true })
  userId: string;

  @Column({ name: 'COURSE_COMPLETION', type: 'tinyint', unsigned: true })
  courseCompletion: number;

  @Column({ name: 'COURSE_ENGAGEMENT', type: 'tinyint', unsigned: true })
  courseEngagement: number;

  @Column({ name: 'PROJECT_DEGREE', type: 'tinyint', unsigned: true })
  projectDegree: number;

  @Column({ name: 'TEAM_PROEJCT_DEGREE', type: 'tinyint', unsigned: true })
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
