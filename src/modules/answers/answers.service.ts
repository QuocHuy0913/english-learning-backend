import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/entities/answer.entity';
import { Repository } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswerLike } from 'src/entities/answer_like';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(AnswerLike)
    private readonly answerLikeRepository: Repository<AnswerLike>,
    private readonly questionsService: QuestionsService,
  ) {}

  async create(questionId: number, dto: CreateAnswerDto, req: any) {
    const question = await this.questionsService.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    const answer = this.answerRepository.create({
      content: dto.content,
      question,
      user: req.user,
    });
    return this.answerRepository.save(answer);
  }

  async findByQuestion(questionId: number, userId: number) {
    const answers = await this.answerRepository.find({
      where: { question: { id: questionId }, parent: require('typeorm').IsNull() }, // chỉ lấy answer cha
      relations: ['user', 'likes', 'replies', 'replies.user', 'replies.likes'],
      order: { created_at: 'ASC' },
    });

    const mapAnswer = (a: Answer) => ({
      id: a.id,
      content: a.content,
      user: { id: a.user.id, name: a.user.name },
      created_at: a.created_at,
      updated_at: a.updated_at,
      like_count: a.likes.length,
      liked_by_current_user: a.likes.some((like) => like.user.id === userId),
      replies:
        a.replies?.map((r) => ({
          id: r.id,
          content: r.content,
          user: { id: r.user.id, name: r.user.name },
          created_at: r.created_at,
          updated_at: r.updated_at,
          like_count: r.likes.length,
          liked_by_current_user: r.likes.some(
            (like) => like.user.id === userId,
          ),
        })) || [],
    });

    return answers.map(mapAnswer);
  }

  async like(answerId: number, userId: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['likes'],
    });
    if (!answer) throw new NotFoundException('Answer not found');

    const existing = answer.likes.find((like) => like.user.id === userId);
    if (!existing) {
      const like = this.answerLikeRepository.create({
        answer,
        user: { id: userId } as any,
      });
      await this.answerLikeRepository.save(like);
    }

    // Cập nhật số lượng like mới
    const updatedAnswer = await this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['likes'],
    });

    return {
      like_count: updatedAnswer ? updatedAnswer.likes.length : 0,
      liked_by_current_user: true,
    };
  }

  async unlike(answerId: number, userId: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['likes'],
    });
    if (!answer) throw new NotFoundException('Answer not found');

    const existing = answer.likes.find((like) => like.user.id === userId);
    if (existing) {
      await this.answerLikeRepository.delete(existing.id);
    }

    const updatedAnswer = await this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['likes'],
    });

    return {
      like_count: updatedAnswer ? updatedAnswer.likes.length : 0,
      liked_by_current_user: false,
    };
  }
  async update(id: number, content: string, req: any) {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    if (req.user.id !== answer.user.id) {
      throw new ForbiddenException('You are not allowed to update this answer');
    }
    answer.content = content;
    await this.answerRepository.update(id, answer);
    return this.answerRepository.findOneBy({ id });
  }

  async remove(id: number, req: any) {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    if (req.user.id !== answer.user.id) {
      throw new ForbiddenException('You are not allowed to delete this answer');
    }
    return this.answerRepository.delete(id);
  }

  async reply(parentAnswerId: number, dto: CreateAnswerDto, req: any) {
    const parentAnswer = await this.answerRepository.findOne({
      where: { id: parentAnswerId },
      relations: ['question'],
    });
    if (!parentAnswer) {
      throw new NotFoundException('Parent answer not found');
    }

    const reply = this.answerRepository.create({
      content: dto.content,
      question: parentAnswer.question,
      user: req.user,
      parent: parentAnswer,
    });

    return this.answerRepository.save(reply);
  }
}
