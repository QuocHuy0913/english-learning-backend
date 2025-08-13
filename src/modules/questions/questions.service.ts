import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { ILike, Like, Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(questionDto: CreateQuestionDto, req: any) {
    const tagsArray = questionDto
      ? (questionDto.tags ?? '').split(',').map((tag) => tag.trim())
      : [];
    const question = this.questionRepository.create({
      ...questionDto,
      tags: tagsArray,
      user: { id: req.user.id },
    });
    return this.questionRepository.save(question);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const [items, total] = await this.questionRepository.findAndCount({
      where: search
        ? [{ title: ILike(`%${search}%`) }, { content: ILike(`%${search}%`) }, { tags: ILike(`%${search}%`) }]
        : {},
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return { items, total };
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
    const question = await this.findById(id);
    if (req.user.id !== question.user.id) {
      throw new ForbiddenException(
        'You are not allowed to update this question',
      );
    }
    question.title = dto.title ?? question.title;
    question.content = dto.content ?? question.content;
    if (dto.tags) {
      question.tags = (dto.tags ?? '').split(',').map((tag) => tag.trim());
    }
    question.updated_at = new Date();
    await this.questionRepository.update(id, question);
    return this.findById(id);
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
