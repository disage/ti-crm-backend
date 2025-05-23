import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDto } from './create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
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

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        role: dto.role,
      },
    });
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
    console.log(
      `Updating refresh token for userId: ${userId}, new refreshToken: ${refreshToken}`,
    );

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken },
      });
      console.log(`Successfully updated user: ${updatedUser.id}`);
    } catch (error) {
      console.error(
        `Failed to update refresh token for userId: ${userId}`,
        error,
      );
      throw new Error('Could not update refresh token');
    }
  }

  async findOneById(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: user.role,
      imgUrl: user.imgUrl || '',
      createdAt: user.createdAt,
    };
  }

  private mapToUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      name: user.name || '',
      imgUrl: user.imgUrl || '',
    };
  }
}
