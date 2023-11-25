import { ProjectsEvaluationInterface } from 'src/interfaces/ProjectsEvaluation';
import { UserEntity } from 'src/user/user.entity';
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export class ProjectsEvaluationEntity implements ProjectsEvaluationInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @OneToOne(() => UserEntity, (user) => user.id)
  @Column({ name: 'USER_ID', type: 'varchar', length: 36, unique: true })
  userId: string;

  @Column({ name: 'COURSE_COMPLETION', type: 'boolean' })
  coursCompletion: boolean;

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
