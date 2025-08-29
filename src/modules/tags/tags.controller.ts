import { Controller, Get, Query } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('popular')
  async getPopularTags(@Query('limit') limit = 6) {
    return { items: await this.tagsService.getPopularTags(limit) };
  }
}
