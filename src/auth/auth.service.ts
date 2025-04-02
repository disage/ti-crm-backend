import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
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

  async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { userId },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.usersService.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new ForbiddenException('Refresh token недействителен');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokens(decoded.userId);

      await this.usersService.updateRefreshToken(
        decoded.userId,
        newRefreshToken,
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw new UnauthorizedException('Неверный или истекший refresh токен');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = await this.usersService.create({
      email: createUserDto.email,
      password: hashedPassword,
      role: 'user',
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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findBy(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    // Сохраняем refresh-токен в базе
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    // Удаляем refresh-токен из базы
    await this.usersService.updateRefreshToken(userId, null);
  }
}
