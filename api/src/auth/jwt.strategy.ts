import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`Validating JWT payload for user: ${payload.username}`);
    // In a real application, you might fetch the user from the database
    // to ensure they still exist and are active, or to load more user details.
    // For now, we'll just return the payload as the user object.
    const user = await this.usersService.findOneByUsername(payload.username);
    if (!user) {
      this.logger.warn(
        `User ${payload.username} not found during JWT validation.`,
      );
      throw new UnauthorizedException();
    }
    // Return a simplified user object that will be attached to req.user
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
