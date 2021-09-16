import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async currentUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOneById(payload.user.id);
    if (!user) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload: JwtPayload = { user: { id: user.id, name: user.name } };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
