// src/reports/dto/report.dto.ts
import { User } from 'src/entities/user.entity';
import { Report } from 'src/entities/report.entity';

export class ReportDto {
  id: number;
  targetType: 'question' | 'answer' | 'comment';
  targetId: number;
  reason: string;
  status: 'pending' | 'reviewed';
  created_at: Date;

  reporter: {
    id: number;
    name: string;
    email: string;
  };

  targetUser: {
    id: number;
    name: string;
    email: string;
  } | null;

  // 👇 thêm tiêu đề / nội dung rút gọn
  targetTitle?: string | null;

  static fromEntity(
    report: Report,
    targetUser: User | null,
    targetTitle?: string | null,
  ): ReportDto {
    return {
      id: report.id,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      status: report.status,
      created_at: report.created_at,
      reporter: {
        id: report.reporter.id,
        name: report.reporter.name,
        email: report.reporter.email,
      },
      targetUser: targetUser
        ? {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
          }
        : null,
      targetTitle: targetTitle ?? null,
    };
  }
}
