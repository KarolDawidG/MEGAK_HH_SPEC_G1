import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { UserInterface } from '../interfaces/UserInterface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: AuthLoginDto,
    @Res() res: Response,
  ): Promise<Omit<UserInterface, 'pwdHash'>> {
    return this.authService.login(loginDto, res);
  }
}
