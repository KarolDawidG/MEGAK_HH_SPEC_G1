import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { UserInterface } from '../interfaces/UserInterface';
import { Response, Request } from 'express';
import { UserObj } from '../decorators/user-obj.decorator';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async user(@Req() request: Request, @UserObj() user: UserEntity) {
    delete user.pwdHash;
    return user;
  }

  @Post('login')
  async login(
    @Body() loginDto: AuthLoginDto,
    @Res() res: Response,
  ): Promise<Omit<UserInterface, 'pwdHash'>> {
    return this.authService.login(loginDto, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @UserObj() user: UserEntity,
    @Res() res: Response,
  ): Promise<any> {
    return this.authService.logout(user, res);
  }
}
