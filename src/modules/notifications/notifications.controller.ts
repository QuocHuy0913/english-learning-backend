import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @Req() req,
    @Query('filter') filter: 'all' | 'unread' | 'personal' | 'global' = 'all',
  ) {
    return this.notificationsService.getUserNotifications(req.user.id, filter);
  }

  @Get(':id')
  async readNotification(@Param('id') id: number, @Req() req) {
    return this.notificationsService.readNotification(Number(id), req.user.id);
  }

  @Patch(':id/read')
  async markNotificationRead(@Param('id') id: number, @Req() req) {
    return this.notificationsService.markNotificationRead(
      Number(id),
      req.user.id,
    );
  }
}
