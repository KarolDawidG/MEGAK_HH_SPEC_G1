import { Column, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  ConversationInterface,
  ConversationStatusEnum,
} from 'src/interfaces/ConversationInterface';
import { HrProfileEntity } from 'src/hrProfile/hrProfile.entity';
import { StudentEntity } from 'src/student/student.entity';

export class Conversation implements ConversationInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => HrProfileEntity, (hr) => hr.id)
  @Column({ name: 'HR_PROFILE_ID', type: 'varchar', length: 36 })
  hrProfileId: string;

  @OneToOne(() => StudentEntity, (student) => student.id)
  @Column({ name: 'STUDENT_ID', type: 'varchar', length: 36 })
  studnetId: string;

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
