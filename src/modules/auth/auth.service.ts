import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async getTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });
    return { accessToken, refreshToken };
  }

  async register(name: string, email: string, password: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(name, email, password);
    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      ...tokens,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      ...tokens,
    };
  }

  async logout(userId: number) {
    return await this.usersService.removeRefreshToken(userId);
  }

  async setRefreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException(
        'Refresh token has been used or is invalid',
      );
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
