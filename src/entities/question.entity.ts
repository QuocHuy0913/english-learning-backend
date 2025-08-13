import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { User } from './user.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  content: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @ManyToOne(() => User, (user) => user.questions, { eager: true })
  user: User;

  @OneToMany(() => Answer, (a) => a.question)
  answers: Answer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
