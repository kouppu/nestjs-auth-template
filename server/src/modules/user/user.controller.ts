import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Param,
  Get,
  Request,
  Post,
  Put,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { UserResponse, UsersResponse } from './responses';
import { UserService } from './user.service';

@Controller({ path: '/users' })
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async index(): Promise<UsersResponse> {
    const users = await this.service.findAll();
    const res = new UsersResponse();
    res.users = users;
    return res;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.service.findOneById(Number(id));
    if (!user) {
      throw new NotFoundException();
    }

    return new UserResponse(user);
  }

  @Post()
  async create(@Body() user: CreateUserDTO): Promise<InsertResult> {
    return await this.service.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req: { user: User },
    @Body() user: UpdateUserDTO,
  ): Promise<UpdateResult> {
    return await this.service.update(req.user.id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Request() req: { user: User }): Promise<DeleteResult> {
    return await this.service.delete(req.user.id);
  }
}
