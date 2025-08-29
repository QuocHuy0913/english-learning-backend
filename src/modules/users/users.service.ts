import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ILike, Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async listUsers(page = 1, limit = 10, status?: string, search?: string) {
    let whereCondition: any = {};

    if (status) {
      whereCondition.status = status as 'active' | 'banned';
    }

    if (search) {
      whereCondition = [
        { ...whereCondition, name: Like(`%${search}%`) },
        { ...whereCondition, email: Like(`%${search}%`) },
      ];
    }

    const [items, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return { items, total };
  }

  async updateUserStatus(id: number, status: 'active' | 'banned') {
    await this.userRepository.update(id, { status });
    return this.userRepository.findOne({ where: { id } });
  }

  async countUsers() {
    return await this.userRepository.count();
  }

  async create(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashed,
    });

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async getByEmail(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async setRefreshToken(id: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    return await this.userRepository.update(id, { refreshToken: hashed });
  }

  async removeRefreshToken(userId: number) {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }
}
