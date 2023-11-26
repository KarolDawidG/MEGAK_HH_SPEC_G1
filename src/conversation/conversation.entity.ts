import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  ConversationInterface,
  ConversationStatusEnum,
} from 'src/interfaces/ConversationInterface';

@Entity({
  name: 'conversations',
})
export class ConversationEntity implements ConversationInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'HR_PROFILE_ID', type: 'varchar', length: 36 })
  hrProfileId: string;

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
