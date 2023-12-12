import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  NotFoundException,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HrProfileService } from './hrProfile.service';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UserObj } from '../decorators/user-obj.decorator';
import { UserEntity } from '../user/user.entity';
import { StudentService } from '../student/student.service';
import { ChooseStudentDto } from '../student/dto/choose-student.dto';
import { roleEnum } from '../interfaces/UserInterface';
import { messages } from '../config/messages';
import { ConversationService } from '../conversation/conversation.service';
import { studentStatus } from '../interfaces/StudentInterface';
import { ConversationEntity } from '../conversation/conversation.entity';
import { ConversationStatusEnum } from '../interfaces/ConversationInterface';
import { UserService } from '../user/user.service';

@Controller('hr-profile')
export class HrProfileController {
  constructor(
    @Inject(HrProfileService)
    private readonly hrProfileService: HrProfileService,
    @Inject(StudentService)
    private readonly studentService: StudentService,
    @Inject(ConversationService)
    private readonly conversationService: ConversationService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('choose-student')
  async choose(
    @UserObj() user: UserEntity,
    @Body() body: ChooseStudentDto,
  ): Promise<ConversationEntity> {
    if (user.role !== roleEnum.hr) {
      throw new UnauthorizedException(messages.onlyForHrUser);
    }
    const student = await this.studentService.findStudentById(body.studentId);
    if (!student) {
      throw new NotFoundException(messages.studentIdNotFound);
    }
    if (student.status !== studentStatus.available) {
      throw new BadRequestException(messages.studentNotAvailable);
    }
    const hrProfile = await this.hrProfileService.find(user.id);
    if (!hrProfile) {
      throw new NotFoundException(messages.hrProfileNotFound);
    }
    const conversation = await this.conversationService.find(
      hrProfile.id,
      student.id,
    );
    if (conversation) {
      throw new BadRequestException(messages.conversationExist);
    }
    const hrConversationsCount = await this.conversationService.hrCount(
      hrProfile.id,
    );
    if (hrConversationsCount >= hrProfile.maxReservedStudents) {
      throw new BadRequestException(messages.hrMaxStudentLimitExceeded);
    }

    return await this.conversationService.startConversation(
      hrProfile.id,
      student.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('hire-student')
  async hire(
    @UserObj() user: UserEntity,
    @Body() body: ChooseStudentDto,
  ): Promise<void> {
    if (user.role !== roleEnum.hr) {
      throw new UnauthorizedException(messages.onlyForHrUser);
    }
    const student = await this.studentService.findStudentById(body.studentId);
    if (!student) {
      throw new NotFoundException(messages.studentIdNotFound);
    }
    const hrProfile = await this.hrProfileService.find(user.id);
    if (!hrProfile) {
      throw new NotFoundException(messages.hrProfileNotFound);
    }
    const conversation = await this.conversationService.find(
      hrProfile.id,
      student.id,
    );
    if (
      !conversation ||
      conversation.status !== ConversationStatusEnum.scheduled
    ) {
      throw new BadRequestException(messages.conversationNotExist);
    }
    await this.conversationService.statusUpdate(
      conversation.id,
      ConversationStatusEnum.completed,
    );
    await this.studentService.statusUpdate(student.id, studentStatus.engaged);
    await this.userService.setAsHired(student.userId, hrProfile.companyName);
  }
}
