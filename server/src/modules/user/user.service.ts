import * as bcrypt from 'bcrypt';
import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository, InsertResult, DeleteResult, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, UpdateUserDTO } from './dto';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id: id });
    if (!user) {
      return null;
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: CreateUserDTO): Promise<InsertResult> {
    if (await this.findOneByEmail(user.email)) {
      throw new BadRequestException('Duplicate email address');
    }

    user.password = this.hashSync(user.password);
    return await this.userRepository.insert(user);
  }

  async update(id: number, user: UpdateUserDTO): Promise<UpdateResult> {
    if (await this.findOneByEmail(user.email)) {
      throw new BadRequestException('Duplicate email address');
    }

    user.password = this.hashSync(user.password);
    return await this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  private hashSync(data: string) {
    return bcrypt.hashSync(data, saltRounds);
  }
}
