import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Passport } from 'passport';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/passports/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES },
    }),
  ],
})
export class AuthModule {}
