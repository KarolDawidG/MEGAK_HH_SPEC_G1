import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserInterface, userRoleEnum } from '../interfaces/UserInterface';

@Entity({
  name: 'users',
})
export class UserEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' }) // @TODO set column length and other options if we agree
  userName: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ type: 'varchar' }) // @TODO set column length and other options if we agree
  pwdHash: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'tinyint', default: 0 })
  userRole: userRoleEnum;

  @Column({ type: 'varchar' }) // @TODO set column length and other options if we agree
  currentToken: string;

  @Column({ type: 'varchar' }) // @TODO set column length and other options if we agree
  registerToken: string;
}
