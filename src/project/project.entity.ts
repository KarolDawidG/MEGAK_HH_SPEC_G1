import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  ProjectInterface,
  ProjectTypeEnum,
} from 'src/interfaces/ProjectInterface';
import { UserEntity } from 'src/user/user.entity';

export class Project implements ProjectInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @OneToOne(() => UserEntity, (user) => user.id)
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
