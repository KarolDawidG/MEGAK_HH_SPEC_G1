import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ProjectInterface,
  ProjectTypeEnum,
} from 'src/interfaces/ProjectInterface';
import { UserEntity } from 'src/user/user.entity';

@Entity({
  name: 'projects',
})
export class ProjectEntity implements ProjectInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'USER_ID' })
  user: UserEntity;

  @Column({ name: 'USER_ID', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'URL', type: 'varchar', length: 255 })
  url: string;

  @Column({ name: 'TYPE', type: 'tinyint' })
  type: ProjectTypeEnum;

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
