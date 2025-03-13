import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/create-user.dto';
import { UserDto } from '../users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.usersService.create({
      email,
      password: hashedPassword,
    } as CreateUserDto);

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
    } as UserDto;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findBy(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
