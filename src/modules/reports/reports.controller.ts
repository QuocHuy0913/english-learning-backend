import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('create')
  async createReport(
    @Req() req,
    @Body('targetType') targetType: 'question' | 'answer' | 'comment',
    @Body('targetId') targetId: number,
    @Body('reason') reason: string,
  ) {
    const user = req.user;
    return this.reportsService.createReport(user, targetType, targetId, reason);
  }
}
