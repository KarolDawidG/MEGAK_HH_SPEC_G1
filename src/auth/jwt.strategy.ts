import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from '../config/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';

export interface JwtPayload {
  id: string;
}

const cookieExtractor = (req: any): null | string => {
  /**
   * @typedef {object} Cookies
   * @property {string} jwt
   */
  return req && req.cookies ? req.cookies.jwt ?? null : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.secretJwt,
    });
  }

  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }

    const user = await this.userRepository.findOne({
      where: { token: payload.id },
    });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user);
  }
}
