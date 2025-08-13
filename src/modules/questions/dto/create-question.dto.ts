import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  title: string;
  
  @IsNotEmpty()
  content: string;

  @IsOptional()
  tags?: string;
}
