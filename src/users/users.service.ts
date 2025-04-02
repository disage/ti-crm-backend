import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email, password } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });

    return {
      id: user.id,
      email: user.email,
      // Добавьте другие поля, которые хотите вернуть
    } as UserDto;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        // Сюда добавьте логику для обновления пароля или других полей по необходимости
        email: updateUserDto.email,
        role: updateUserDto.role, // Или любые другие поля, которые нужно обновить
      },
    });
    return this.mapToUserDto(user);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.mapToUserDto(user));
  }

  async findBy(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.prisma.user.update({
      where: { id: userId }, // Указываем, какого пользователя обновить
      data: { refreshToken }, // Передаём новые данные
    });
  }

  private mapToUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
