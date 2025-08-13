import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string; // hashed

  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string; // hashed refresh token

  @OneToMany(() => Question, (q) => q.user)
  questions: Question[];

  @OneToMany(() => Answer, (a) => a.user)
  answers: Answer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
