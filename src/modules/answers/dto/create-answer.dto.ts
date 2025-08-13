import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
