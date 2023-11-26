import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  ProjectInterface,
  projectTypeEnum,
} from 'src/interfaces/ProjectInterface';

@Entity({
  name: 'projects',
})
export class ProjectEntity implements ProjectInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'USER_ID', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'URL', type: 'varchar', length: 255 })
  url: string;

  @Column({ name: 'TYPE', type: 'tinyint' })
  type: projectTypeEnum;

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
