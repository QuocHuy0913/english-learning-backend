import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async createAdmin(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.adminService.createAdmin(name, email, password);
  }

  @Get('growth')
  async getGrowth() {
    return this.adminService.getMonthlyGrowth();
  }

  // =============================
  // 1. User management
  // =============================
  @Get('users')
  async listUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.listUsers(
      Number(page),
      Number(limit),
      status,
      search,
    );
  }

  @Patch('users/:id')
  async updateUserStatus(
    @Param('id') id: number,
    @Body('status') status: 'active' | 'banned',
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Get('users/count')
  async countUsers() {
    return this.adminService.countUsers();
  }

  @Post('users/email')
  async findUserByEmail(@Body('email') email: string) {
    return this.adminService.findUserByEmail(email);
  }

  @Get('users/:id')
  async findUserById(@Param('id') id: number) {
    return this.adminService.findUserById(id);
  }

  // =============================
  // 2. Question management
  // =============================

  @Get('questions/count')
  async countAllQuestions() {
    return this.adminService.countAllQuestions();
  }

  @Get('questions')
  async listQuestions(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.adminService.listQuestions(Number(page), Number(limit), search);
  }

  @Delete('questions/:id')
  async deleteQuestion(@Param('id') id: string) {
    const questionId = Number(id);
    return this.adminService.deleteQuestion(questionId);
  }

  @Get('questions/:id')
  async getQuestionById(@Param('id') id: number) {
    return this.adminService.getQuestionById(id);
  }

  // =============================
  // 3. Answer management
  // =============================
  @Get('answers/all')
  async findAll(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.adminService.findAllAnswers(req.user.id, +page, +limit);
  }
  @Get('answers/count')
  async countAllAnswers() {
    return this.adminService.countAllAnswers();
  }

  @Get('answers/:questionId')
  async listAnswersByQuestion(
    @Param('questionId') questionId: number,
    @Query('userId') userId: number,
  ) {
    return this.adminService.listAnswersByQuestion(questionId, userId);
  }

  @Delete('answers/:id')
  async deleteAnswer(@Param('id') id: number) {
    return this.adminService.deleteAnswer(id);
  }

  @Get('answers/likes/total')
  async getTotalAnswerLikes() {
    return this.adminService.getTotalAnswerLikes();
  }

  // =============================
  // 4. Tag management
  // =============================
  @Get('tags')
  async listTags() {
    return this.adminService.listTags();
  }

  @Delete('tags/:id')
  async deleteTag(@Param('id') id: number) {
    return this.adminService.deleteTag(id);
  }

  // =============================
  // 5. Report management
  // =============================

  @Get('reports/count')
  async countReports() {
    return this.adminService.countReports();
  }

  @Get('reports')
  async listReports(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: 'pending' | 'reviewed',
    @Query('targetType') targetType?: 'question' | 'answer' | 'comment',
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    return this.adminService.listReports({
      page: Number(pageNumber),
      limit: Number(limitNumber),
      search,
      status,
      targetType,
    });
  }

  @Get('reports/:id')
  async reviewReport(@Param('id') id: number) {
    return this.adminService.reviewReport(id);
  }

  @Patch('reports/:id')
  async updateReportStatus(
    @Param('id') id: number,
    @Body('status') status: 'pending' | 'reviewed',
  ) {
    return this.adminService.updateReportStatus(id, status);
  }

  // =============================
  // 6. Notifications management
  // =============================
  @Get('notifications/count')
  async countNotifications() {
    return this.adminService.countNotifications();
  }

  @Get('notifications')
  async listNotifications(
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.listNotifications({
      userId: Number(userId),
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Post('notifications')
  async createNotification(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('isGlobal') isGlobal?: boolean,
    @Body('userId') userId?: number,
  ) {
    return this.adminService.createNotification({
      title,
      content,
      isGlobal,
      userId,
    });
  }

  @Patch('notifications/:id')
  async updateNotification(
    @Param('id') id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
    @Body('isGlobal') isGlobal?: boolean,
    @Body('userId') userId?: number,
  ) {
    return this.adminService.updateNotification({
      id,
      title,
      content,
      isGlobal,
      userId,
    });
  }

  @Delete('notifications/:id')
  async deleteNotification(@Param('id') id: number) {
    return this.adminService.deleteNotification(id);
  }
}
