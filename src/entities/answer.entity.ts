// answer.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { User } from './user.entity';
import { AnswerLike } from './answer_like';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ type: 'int', default: 0 })
  like_count: number;

  @OneToMany(() => AnswerLike, (like) => like.answer, { cascade: true })
  likes: AnswerLike[];

  @ManyToOne(() => Question, (q) => q.answers, { onDelete: 'CASCADE' })
  question: Question;

  @ManyToOne(() => User, (u) => u.answers, { eager: true })
  user: User;

  @ManyToOne(() => Answer, (a) => a.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: Answer;

  @OneToMany(() => Answer, (a) => a.parent, { cascade: true })
  replies: Answer[];

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
