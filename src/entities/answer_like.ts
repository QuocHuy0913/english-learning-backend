// answer-like.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { User } from './user.entity';

@Entity('answer_likes')
@Unique(['answer', 'user']) // Mỗi user chỉ like 1 lần cho 1 answer
export class AnswerLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Answer, (answer) => answer.likes, { onDelete: 'CASCADE' })
  answer: Answer;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0, // bỏ microseconds
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
