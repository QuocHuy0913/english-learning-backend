import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/entities/answer.entity';
import { Question } from 'src/entities/question.entity';
import { Report } from 'src/entities/report.entity';
import { User } from 'src/entities/user.entity';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { ReportDto } from '../admin/dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async countReports(): Promise<number> {
    return this.reportRepository.count();
  }

  async createReport(
    reporter: User,
    targetType: 'question' | 'answer' | 'comment',
    targetId: number,
    reason: string,
  ): Promise<Report> {
    const report = this.reportRepository.create({
      reporter,
      targetType,
      targetId,
      reason,
      status: 'pending',
    });
    return this.reportRepository.save(report);
  }

  async listReports(
    page = 1,
    limit = 10,
    search?: string,
    status?: 'pending' | 'reviewed',
    targetType?: 'question' | 'answer' | 'comment',
  ) {
    const where: any = {};

    if (search) {
      where.reason = Like(`%${search}%`);
    }

    if (status) {
      where.status = status;
    }

    if (targetType) {
      where.targetType = targetType;
    }

    const [items, total] = await this.reportRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      relations: ['reporter'],
    });

    const enriched = await Promise.all(
      items.map(async (report) => {
        let targetUser: User | null = null;
        let targetTitle: string | null = null; 

        if (report.targetType === 'question') {
          const q = await this.questionRepository.findOne({
            where: { id: report.targetId },
            select: { id: true, title: true },
            relations: ['user'],
          });
          targetUser = q?.user ?? null;
          targetTitle = q?.title ?? null;
        }

        if (report.targetType === 'answer') {
          const a = await this.answerRepository.findOne({
            where: { id: report.targetId },
            select: { id: true, content: true },
            relations: ['user'],
          });
          targetUser = a?.user ?? null;
          targetTitle = a
            ? a.content.slice(0, 50) + (a.content.length > 50 ? '...' : '')
            : null;
        }

        return ReportDto.fromEntity(report, targetUser, targetTitle);
      }),
    );

    return { items: enriched, total };
  }

  async reviewReport(id: number, status: 'reviewed') {
    await this.reportRepository.update(id, { status });
    return this.reportRepository.findOne({ where: { id } });
  }

  async updateReportStatus(id: number, status: 'pending' | 'reviewed') {
    // Lấy report hiện tại
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException();

    // Gán status mới
    report.status = status;

    // Lưu vào DB và trả về bản ghi mới
    const updatedReport = await this.reportRepository.save(report);
    return updatedReport;
  }
}
