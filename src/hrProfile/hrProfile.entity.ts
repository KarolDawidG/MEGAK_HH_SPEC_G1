import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HRProfileInterface } from 'src/interfaces/HrProfileInterface';
import { UserEntity } from 'src/user/user.entity';

@Entity({
  name: 'hr_profiles',
})
export class HrProfileEntity implements HRProfileInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'USER_ID' })
  user: UserEntity;

  @Column({ name: 'USER_ID', type: 'varchar', length: 36 })
  userId: string;

  @Column({ name: 'FIRST_NAME', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'LAST_NAME', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'MAX_RESERVED_STUDENTS', type: 'smallint', unsigned: true })
  maxReservedStudents: number;

  @Column({ name: 'COMPANY_NAME', type: 'varchar', length: 300 })
  companyName: string;

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
