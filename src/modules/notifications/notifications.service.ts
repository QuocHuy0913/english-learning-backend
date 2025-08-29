import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async countNotification(): Promise<number> {
    return this.notificationRepository.count();
  }

  // Lấy danh sách notification của user
  async getUserNotifications(
    userId: number,
    filter: 'all' | 'unread' | 'personal' | 'global',
  ) {
    const where: any = [];

    // all: global hoặc personal của user
    if (filter === 'all') {
      where.push({ isGlobal: true }, { isGlobal: false, user: { id: userId } });
    }

    // unread: chỉ personal chưa đọc
    if (filter === 'unread') {
      where.push({ isGlobal: false, read: false, user: { id: userId } });
    }

    // personal: tất cả personal
    if (filter === 'personal') {
      where.push({ isGlobal: false, user: { id: userId } });
    }

    // global: chỉ global
    if (filter === 'global') {
      where.push({ isGlobal: true });
    }

    const [items, total] = await this.notificationRepository.findAndCount({
      where,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return {
      items: items.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        isGlobal: n.isGlobal,
        read: n.read,
        created_at: n.created_at,
        updated_at: n.updated_at,
        user: n.user,
      })),
      total,
    };
  }

  // Đọc 1 notification của user và đánh dấu đã đọc
  async readNotification(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: [
        { id, user: { id: userId } },
        { id, isGlobal: true },
      ],
    });

    if (!notification) throw new NotFoundException('Notification not found');

    if (!notification.read) {
      notification.read = true;
      await this.notificationRepository.save(notification);
    }

    return notification;
  }

  async listNotifications(userId?: number, page = 1, limit = 10) {
    const pageNumber = Math.max(page || 1, 1);
    const limitNumber = Math.min(Math.max(limit || 10, 1), 100);

    const where: FindOptionsWhere<Notification>[] = userId
      ? [{ isGlobal: true }, { isGlobal: false, user: { id: userId } }]
      : [];

    const [items, total] = await this.notificationRepository.findAndCount({
      where,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      order: { created_at: 'DESC' },
    });

    return { items, total };
  }

  async createNotification(
    title: string,
    content: string,
    isGlobal = true,
    userId?: number,
  ) {
    let user: User | null = null;

    if (!isGlobal && userId) {
      user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new Error('User không tồn tại');
    }

    const notification = this.notificationRepository.create({
      title,
      content,
      isGlobal,
      user,
    });

    return this.notificationRepository.save(notification);
  }

  async updateNotification(
    id: number,
    title?: string,
    content?: string,
    isGlobal?: boolean,
    userId?: number,
  ) {
    const updateData: Partial<Notification> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isGlobal !== undefined) updateData.isGlobal = isGlobal;

    if (!isGlobal && userId !== undefined) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new Error('User không tồn tại');
      updateData.user = user;
    }

    await this.notificationRepository.update(id, updateData);

    return this.notificationRepository.findOne({ where: { id } });
  }

  async deleteNotification(id: number) {
    return this.notificationRepository.delete(id);
  }

  async markNotificationRead(id: number, userId: number) {
    const noti = await this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!noti) throw new NotFoundException('Notification not found');

    noti.read = true;
    return this.notificationRepository.save(noti); // ✅ lưu DB
  }

  async markAllNotificationsRead(userId: number) {
    await this.notificationRepository.update(
      { user: { id: userId }, read: false },
      { read: true },
    );
    return { success: true };
  }
}
