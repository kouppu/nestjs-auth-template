import { Type } from 'class-transformer';
import { User } from '../user.entity';
import { UserResponse } from './user.response';

export class UsersResponse {
  @Type(() => UserResponse)
  users: User[];
}
