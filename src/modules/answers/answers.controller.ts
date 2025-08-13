import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('questions/:questionId')
  async create(
    @Param('questionId') questionId: string,
    @Body() dto: CreateAnswerDto,
    @Req() req: any,
  ) {
    return this.answersService.create(Number(questionId), dto, req);
  }

  @Get('questions/:id')
  async getByQuestion(@Param('id') questionId: number, @Req() req: any) {
    const userId = req.user?.id; // nếu người dùng chưa login thì undefined
    return this.answersService.findByQuestion(questionId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Req() req: any,
  ) {
    return this.answersService.update(Number(id), body.content, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.answersService.remove(Number(id), req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/like')
  async like(@Param('id') id: number, @Req() req) {
    return this.answersService.like(+id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/unlike')
  async unlike(@Param('id') id: number, @Req() req) {
    return this.answersService.unlike(+id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/replies')
  async replyToAnswer(
    @Param('id') id: string,
    @Body() dto: CreateAnswerDto,
    @Req() req: any,
  ) {
    return this.answersService.reply(Number(id), dto, req);
  }
}
