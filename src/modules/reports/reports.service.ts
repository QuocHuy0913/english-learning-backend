import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { User } from 'src/entities/user.entity';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
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
    const pageNumber = Math.max(page, 1);
    const limitNumber = Math.min(Math.max(limit, 1), 100);

    const where: FindOptionsWhere<Report> = {};

    if (search) where.reason = Like(`%${search}%`);
    if (status) where.status = status;
    if (targetType) where.targetType = targetType;

    const [items, total] = await this.reportRepository.findAndCount({
      where,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      order: { created_at: 'DESC' },
    });

    return { items, total };
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
