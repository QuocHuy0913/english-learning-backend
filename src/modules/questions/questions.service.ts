import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { Like, Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Tag } from 'src/entities/tag.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async countAll(): Promise<number> {
    return this.questionRepository.count();
  }

  async deleteQuestionAdmin(id: number) {
    const question = await this.questionRepository.findOneBy({ id: id });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    await this.questionRepository.delete(id);
    return question;
  }

  async create(questionDto: CreateQuestionDto, req: any) {
    const tags: Tag[] = [];

    if (questionDto.tags) {
      const tagNames = questionDto.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      for (const tagName of tagNames) {
        let tag = await this.tagRepository.findOneBy({ name: tagName });
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          await this.tagRepository.save(tag);
        }
        tags.push(tag);
      }
    }

    const question = this.questionRepository.create({
      ...questionDto,
      tags,
      user: { id: req.user.id },
    });
    return this.questionRepository.save(question);
  }

  async findAll(
    page = 1,
    limit = 10,
    keyword?: string,
    tagSearch?: string, // comma-separated tags
  ) {
    const where: any[] = [];

    if (keyword) {
      where.push({ title: Like(`%${keyword}%`) });
      where.push({ content: Like(`%${keyword}%`) });
    }

    // Lấy kèm user và tags
    const [items, total] = await this.questionRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      relations: ['tags', 'user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    let filtered = items;

    if (tagSearch) {
      const tags = tagSearch.split(',').map((t) => t.trim().toLowerCase());
      filtered = filtered.filter((q) =>
        q.tags.some((t) => tags.includes(t.name.toLowerCase())),
      );
    }

    return { items: filtered, total };
  }

  async findByUser(userId: number, page = 1, limit = 10) {
    const [items, total] = await this.questionRepository.findAndCount({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return { items, total };
  }

  async findById(id: number) {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new UnauthorizedException('Question not found');
    }
    return question;
  }

  async update(id: number, dto: Partial<CreateQuestionDto>, req: any) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['user', 'tags'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (req.user.id !== question.user.id) {
      throw new ForbiddenException(
        'You are not allowed to update this question',
      );
    }

    // Cập nhật title và content
    if (dto.title !== undefined) {
      question.title = dto.title.trim();
    }
    if (dto.content !== undefined) {
      question.content = dto.content.trim();
    }

    // Cập nhật tags nếu có
    if (dto.tags !== undefined) {
      const tags: Tag[] = [];
      let tagNames: string[] = [];

      if (Array.isArray(dto.tags)) {
        tagNames = dto.tags
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      } else if (typeof dto.tags === 'string') {
        tagNames = dto.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      for (const tagName of tagNames) {
        let tag = await this.tagRepository.findOneBy({ name: tagName });
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          await this.tagRepository.save(tag);
        }
        tags.push(tag);
      }

      question.tags = tags;
    }

    question.updated_at = new Date();

    await this.questionRepository.save(question); // dùng save thay vì update
    return question;
  }

  async remove(id: number, req: any) {
    const question = await this.findById(id);
    if (question.user.id !== req.user.id) {
      throw new ForbiddenException(
        'You are not allowed to delete this question',
      );
    }
    return this.questionRepository.delete(id);
  }
}
