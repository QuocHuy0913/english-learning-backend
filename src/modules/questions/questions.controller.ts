import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    return this.questionsService.findAll(pageNumber, limitNumber, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findMyQuestions(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    return this.questionsService.findByUser(
      req.user.id,
      pageNumber,
      limitNumber,
    );
  }

  @Get('/:id')
  async detail(@Param('id') id: string) {
    return this.questionsService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateQuestionDto, @Req() req: any) {
    return this.questionsService.create(dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateQuestionDto>,
    @Req() req: any,
  ) {
    return this.questionsService.update(Number(id), dto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.questionsService.remove(Number(id), req);
  }
}
