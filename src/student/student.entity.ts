import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {
  StudentInterface,
  contractTypeEnum,
  studentStatus,
  workTypeEnum,
} from 'src/interfaces/StudentInterface';
import { UserEntity } from 'src/user/user.entity';

@Entity({
  name: 'students',
})
export class StudentEntity implements StudentInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'USER_ID' })
  user: UserEntity;

  /*@OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'USER_ID' })
  user: UserEntity;

  @Column({ name: 'USER_ID', length: 36, type: 'varchar', unique: true })
  userId: string;
  */

  @Column({ name: 'STATUS', type: "enum", enum: studentStatus, default: studentStatus.available })
  status: studentStatus;

  @Column({ name: 'FIRST_NAME', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'LAST_NAME', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'PHONE_NUMBER', type: 'varchar', length: 15, nullable: true })
  phoneNumber: string;

  @Column({
    name: 'GITHUB_USERNAME',
    type: 'varchar',
    length: 39,
    nullable: true,
  })
  githubName: string | null;

  @Column({ name: 'BIO', type: 'varchar', length: 5000 })
  bio: string;

  @Column({ name: 'EXPECTED_WORK_TYPE', type: "enum", enum: workTypeEnum, default: workTypeEnum.noPreferences })
  expectedWorkType: workTypeEnum;

  @Column({ name: 'TARGET_WORK_CITY', type: 'varchar', length: 100 })
  targetWorkCity: string;

  @Column({ name: 'CONTRACT_TYPE', type: "enum", enum: contractTypeEnum, default: contractTypeEnum.noPreferences })
  expectedContractType: contractTypeEnum;

  @Column({
    name: 'EXPECTED_SALARY',
    type: 'double',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  expectedSalary: number | null;

  @Column({ name: 'CAN_TAKE_APPRENTICESHIP', type: 'boolean', default: false })
  canTakeApprenticeship: boolean;

  @Column({
    name: 'MONTHS_OF_COMMERCIAL_EXPERIENCE',
    type: 'int',
    default: 0,
  })
  monthsOfCommercialExperience: number;

  @Column({ name: 'EDUCATION', type: 'varchar', nullable: true })
  education: string;

  @Column({ name: 'WORK_EXPERIENCE', type: 'text', nullable: true })
  workExperience: string;

  @Column({ name: 'COURSES', type: 'text' })
  courses: string;

  @Column({
    name: 'CREATED_AT',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Column({
    name: 'UPDATED_AT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: () => string;
}
