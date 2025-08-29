import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['question', 'answer', 'comment'] })
  targetType: 'question' | 'answer' | 'comment';

  @Column()
  targetId: number;

  @ManyToOne(() => User, { eager: true })
  reporter: User;

  @Column('text')
  reason: string;

  @Column({ type: 'enum', enum: ['pending', 'reviewed'], default: 'pending' })
  status: 'pending' | 'reviewed';

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
