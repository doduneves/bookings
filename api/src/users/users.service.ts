import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findOneByUsername(username: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(
    username: string,
    passwordPlain: string,
    email?: string,
    role?: string,
  ): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      email,
      role,
    });
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<Partial<UserEntity>[]> {
    const usersList = await this.usersRepository.find();

    return usersList.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }
}
