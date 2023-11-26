import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserChangePassword } from './dto/user.change-password';
import { messages } from '../config/messages';
import { UserNewPassword } from './dto/user.new-password';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-password')
  async changePassword(@Body() body: UserChangePassword): Promise<void> {
    const user = await this.userService.findOne(body.email);
    if (!user) {
      throw new BadRequestException(messages.emailNotFound);
    }
    if (!user.isActive) {
      throw new BadRequestException(messages.userIsNotActive);
    }
    await this.userService.changePassword(user.email, user.id);
  }

  @Post('new-password')
  async newPassword(@Body() body: UserNewPassword): Promise<void> {
    const user = await this.userService.findOne(body.email);
    if (!user) {
      throw new BadRequestException(messages.emailNotFound);
    }
    if (!user.isActive) {
      throw new BadRequestException(messages.userIsNotActive);
    }
    if (user.token !== body.token || user.id !== body.id) {
      throw new BadRequestException(messages.newPasswordInvalidBody);
    }
    await this.userService.newPassword(user.id, user.email, body.password);
  }
}
