import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Between, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { QuestionsService } from '../questions/questions.service';
import { AnswersService } from '../answers/answers.service';
import { TagsService } from '../tags/tags.service';
import { ReportsService } from '../reports/reports.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Question } from 'src/entities/question.entity';
import { Answer } from 'src/entities/answer.entity';
import { Report } from 'src/entities/report.entity';
import { Notification } from 'src/entities/notification.entity';
import { AnswerLike } from 'src/entities/answer_like';
import { use } from 'passport';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(AnswerLike)
    private answerLikeRepo: Repository<AnswerLike>,
    @InjectRepository(Report) private reportRepo: Repository<Report>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private readonly usersService: UsersService,
    private readonly questionsService: QuestionsService,
    private readonly answersService: AnswersService,
    private readonly tagsService: TagsService,
    private readonly reportsService: ReportsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createAdmin(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });

    return this.userRepo.save(admin);
  }

  async getMonthlyGrowth() {
    const now = new Date();
    const year = now.getFullYear();

    const results: {
      month: string;
      users: number;
      questions: number;
      answers: number;
      likes: number;
      reports: number;
      notifications: number;
    }[] = [];

    for (let month = 1; month <= 12; month++) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);

      const users = await this.userRepo.count({
        where: { created_at: Between(start, end) },
      });

      const questions = await this.questionRepo.count({
        where: { created_at: Between(start, end) },
      });

      const answers = await this.answerRepo.count({
        where: { created_at: Between(start, end) },
      });

      const likes = await this.answerLikeRepo.count({
        where: { created_at: Between(start, end) },
      });

      const reports = await this.reportRepo.count({
        where: { created_at: Between(start, end) },
      });

      const notifications = await this.notificationRepo.count({
        where: { created_at: Between(start, end) },
      });

      results.push({
        month: start.toLocaleString('default', { month: 'short' }),
        users,
        questions,
        answers,
        likes,
        reports,
        notifications,
      });
    }

    return results;
  }

  //1.User management
  async listUsers(page = 1, limit = 10, status?: string, search?: string) {
    return this.usersService.listUsers(page, limit, status, search);
  }

  async updateUserStatus(id: number, status: 'active' | 'banned') {
    return this.usersService.updateUserStatus(id, status);
  }

  async countUsers() {
    return this.usersService.countUsers();
  }

  async findUserByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }

  async findUserById(id: number) {
    return this.usersService.findById(id);
  }

  //2.Question management
  async countAllQuestions() {
    return this.questionsService.countAll();
  }

  async listQuestions(page = 1, limit = 10, search?: string) {
    return this.questionsService.findAll(page, limit, search);
  }

  async deleteQuestion(id: number) {
    // ép kiểu cho chắc chắn
    const questionId = Number(id);
    return this.questionsService.deleteQuestionAdmin(questionId);
  }

  async getQuestionById(id: number) {
    return this.questionsService.findById(id);
  }

  //3.Answer management
  async countAllAnswers() {
    return this.answersService.countAll();
  }

  async listAnswersByQuestion(questionId: number, userId: number) {
    return this.answersService.findByQuestion(questionId, userId);
  }

  async findAllAnswers(userId: number, page = 1, limit = 10) {
    return this.answersService.findAllWithQuestion(userId, page, limit);
  }

  async deleteAnswer(id: number) {
    return this.answersService.deleteAnswer(id);
  }

  async getTotalAnswerLikes() {
    return this.answersService.getTotalLikes();
  }

  // 4. Tag management
  async listTags() {
    return this.tagsService.listTags();
  }

  async deleteTag(id: number) {
    return this.tagsService.deleteTag(id);
  }

  // 5. Report management
  async countReports() {
    return this.reportsService.countReports();
  }
  async listReports(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'pending' | 'reviewed';
    targetType?: 'question' | 'answer' | 'comment';
  }) {
    return this.reportsService.listReports(
      params.page,
      params.limit,
      params.search,
      params.status,
      params.targetType,
    );
  }

  async reviewReport(id: number) {
    return this.reportsService.reviewReport(id, 'reviewed');
  }

  async updateReportStatus(id: number, status: 'pending' | 'reviewed') {
    return this.reportsService.updateReportStatus(id, status);
  }

  //6. Notifications management
  async countNotifications() {
    return this.notificationsService.countNotification();
  }

  async listNotifications(params: {
    userId?: number;
    page?: number;
    limit?: number;
  }) {
    return this.notificationsService.listNotifications(
      params.userId,
      params.page,
      params.limit,
    );
  }

  async createNotification(data: {
    title: string;
    content: string;
    isGlobal?: boolean;
    userId?: number;
  }) {
    return this.notificationsService.createNotification(
      data.title,
      data.content,
      data.isGlobal,
      data.userId,
    );
  }

  async updateNotification(data: {
    id: number;
    title?: string;
    content?: string;
    isGlobal?: boolean;
    userId?: number;
  }) {
    return this.notificationsService.updateNotification(
      data.id,
      data.title,
      data.content,
      data.isGlobal,
      data.userId,
    );
  }

  async deleteNotification(id: number) {
    return this.notificationsService.deleteNotification(id);
  }
}
