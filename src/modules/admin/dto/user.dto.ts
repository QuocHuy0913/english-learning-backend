import { IsEnum } from 'class-validator';

export class UpdateUserStatusDto {
  @IsEnum(['active', 'banned'])
  status: 'active' | 'banned';
}
