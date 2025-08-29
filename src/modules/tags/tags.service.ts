import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async listTags() {
    return this.tagRepository.find({
      order: { name: 'ASC' },
    });
  }

  async getPopularTags(limit = 6) {
    const result = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.questions', 'question')
      .select('tag.id', 'id')
      .addSelect('tag.name', 'name')
      .addSelect('COUNT(question.id)', 'usageCount')
      .addSelect('MAX(tag.created_at)', 'createdAt')
      .groupBy('tag.id')
      .orderBy('"usageCount"', 'DESC')
      .addOrderBy('"createdAt"', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((r) => ({
      id: Number(r.id),
      name: r.name,
      usageCount: Number(r.usageCount),
      createdAt: r.createdAt,
    }));
  }

  async deleteTag(id: number) {
    // Lấy tag cùng tất cả questions liên quan
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['questions'],
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    await this.tagRepository
      .createQueryBuilder()
      .relation(Tag, 'questions')
      .of(tag)
      .remove(tag.questions);

    await this.tagRepository.delete(id);
    return tag;
  }
}
