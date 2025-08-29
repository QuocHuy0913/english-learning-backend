import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Question } from 'src/entities/question.entity';
import { Answer } from 'src/entities/answer.entity';
import { Tag } from 'src/entities/tag.entity';
import { Notification } from 'src/entities/notification.entity';
import { Report } from 'src/entities/report.entity';
import { UsersModule } from '../users/users.module';
import { QuestionsModule } from '../questions/questions.module';
import { AnswersModule } from '../answers/answers.module';
import { TagsModule } from '../tags/tags.module';
import { ReportsModule } from '../reports/reports.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AnswerLike } from 'src/entities/answer_like';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Question,
      Answer,
      Tag,
      Report,
      Notification,
      AnswerLike
    ]),
    UsersModule,
    QuestionsModule,
    AnswersModule,
    TagsModule,
    ReportsModule,
    NotificationsModule,
  ],
})
export class AdminModule {}
