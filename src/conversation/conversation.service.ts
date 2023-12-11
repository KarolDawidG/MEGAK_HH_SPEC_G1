import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { ConversationStatusEnum } from '../interfaces/ConversationInterface';
import { StudentService } from '../student/student.service';
import { studentStatus } from '../interfaces/StudentInterface';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private conversationRepository: Repository<ConversationEntity>,
    @Inject(StudentService)
    private studentService: StudentService,
  ) {}
  async hrCount(hrProfileId: string): Promise<number> {
    try {
      return await this.conversationRepository.count({
        where: { hrProfileId },
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async startConversation(
    hrProfileId: string,
    studentId: string,
  ): Promise<ConversationEntity> {
    try {
      await this.studentService.statusUpdate(
        studentId,
        studentStatus.duringConversation,
      );
      return await this.conversationRepository.save({
        hrProfileId,
        studentId,
        status: ConversationStatusEnum.scheduled,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
