import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from 'src/entities/answer.entity';
import { Question } from 'src/entities/question.entity';
import { User } from 'src/entities/user.entity';
import { QuestionsModule } from '../questions/questions.module';
import { QuestionsService } from '../questions/questions.service';
import { AnswerLike } from 'src/entities/answer_like';
import { Tag } from 'src/entities/tag.entity';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService, QuestionsService],
  imports: [
    TypeOrmModule.forFeature([Answer, AnswerLike, Question, User, Tag]),
    QuestionsModule,
  ],
  exports: [AnswersService],
})
export class AnswersModule {}
