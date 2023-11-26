import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ConversationInterface,
  ConversationStatusEnum,
} from 'src/interfaces/ConversationInterface';
import { HrProfileEntity } from 'src/hrProfile/hrProfile.entity';
import { StudentEntity } from 'src/student/student.entity';

@Entity({
  name: 'conversations',
})
export class ConversationEntity implements ConversationInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => HrProfileEntity, (hr) => hr.id)
  @JoinColumn({ name: 'HR_PROFILE_ID' })
  hrProfile: HrProfileEntity;

  @Column({ name: 'HR_PROFILE_ID', type: 'varchar', length: 36 })
  hrProfileId: string;

  @ManyToOne(() => StudentEntity, (student) => student.id)
  @JoinColumn({ name: 'STUDENT_ID' })
  student: StudentEntity;

  @Column({ name: 'STUDENT_ID', type: 'varchar', length: 36 })
  studentId: string;

  @Column({ name: 'STATUS', type: 'tinyint' })
  status: ConversationStatusEnum;

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
