import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { AuthLoginDto } from './dto/auth.login.dto';
import { hashPwd } from '../utils/hash-pwd';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { JwtPayload } from './jwt.strategy';
import { config } from '../config/config';
import { UserInterface } from '../interfaces/UserInterface';
import { messages } from '../config/messages';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = config.tokenExpirationTime;
    const accessToken = sign(payload, config.secretJwt, { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: UserInterface): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await this.userRepository.findOne({
        where: { token },
      });
    } while (!!userWithThisToken);
    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        token,
      },
    );
    return token;
  }

  async login(loginDto: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email, pwdHash: hashPwd(loginDto.password) },
      });
      delete user.pwdHash;

      const token = this.createToken(await this.generateToken(user));
      console.log(token); // REMOVE THIS
      return res
        .cookie('jwt', token.accessToken, {
          secure: false, // if you use https then change it to TRUE !!!!
          domain: 'localhost',
          httpOnly: true,
        })
        .status(200)
        .json(user);
    } catch {
      throw new UnauthorizedException(messages.invalidLoginData);
    }
  }

  async logout(user: UserEntity, res: Response): Promise<any> {
    try {
      await this.userRepository.findOne({
        where: { id: user.id, token: null },
      });
      return res
        .clearCookie('jwt', {
          secure: false, // if you use https then change it to TRUE !!!!
          domain: 'localhost',
          httpOnly: true,
        })
        .json({ message: messages.loggedOut });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
