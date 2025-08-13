import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

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
    return await this.userRepository.findOneBy({ email });
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async setRefreshToken(id: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    return await this.userRepository.update(id, { refreshToken: hashed });
  }

  async removeRefreshToken(userId: number) {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }
}
