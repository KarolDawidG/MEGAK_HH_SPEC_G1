import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { messages } from '../config/messages';
import { hashPwd } from '../utils/hash-pwd';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(MailService)
    private mailService: MailService,
  ) {}

  async findOne(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async changePassword(email: string, id: string): Promise<void> {
    try {
      const token = uuid();
      await this.userRepository.update(id, { token });
      await this.mailService.sendMail(
        email,
        messages.changePasswordSubject,
        messages.changePasswordHtml + id + '/' + token,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async newPassword(
    id: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      const pwdHash = hashPwd(password);
      await this.userRepository.update(id, { pwdHash, token: '' });
      await this.mailService.sendMail(
        email,
        messages.newPasswordSubject,
        messages.newPasswordHtml,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
