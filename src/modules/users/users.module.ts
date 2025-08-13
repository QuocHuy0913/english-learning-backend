import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtStrategy } from 'src/passports/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { Question } from 'src/entities/question.entity';
import { Answer } from 'src/entities/answer.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Question, Answer]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
