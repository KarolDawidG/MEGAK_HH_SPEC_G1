import {Entity, Column, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import { UserInterface, roleEnum } from '../interfaces/UserInterface';
import { StudentEntity } from 'src/student/student.entity';
import { ProjectsEvaluationEntity } from 'src/projects-evaluation/projects-evaluation.entity';

@Entity({
  name: 'users',
})
export class UserEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'EMAIL', unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({
    name: 'CREATED_AT',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Column({
    name: 'REGISTERED_AT',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  registeredAt: string;

  @Column({ name: 'PASSWORD_HASH', type: 'varchar' }) // @TODO set column length and other options if we agree
  pwdHash: string;

  @Column({ name: 'IS_ACTIVE', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'ROLE', type: 'tinyint', default: 0 })
  role: roleEnum;

  @Column({ name: 'TOKEN', type: 'varchar' }) // @TODO set column length and other options if we agree
  token: string;

  @OneToOne(() => StudentEntity, (student) => student.user)
  student: StudentEntity;

  @OneToOne(() => ProjectsEvaluationEntity, (project) => project.user)
  projectEvaluation: ProjectsEvaluationEntity;
}
