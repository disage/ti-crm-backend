import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './user.dto'; // Импортируем DTO для пользователя
import { CreateUserDto } from './create-user.dto'; // Импортируем DTO для создания пользователя

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() body: CreateUserDto, // Изменено на использование CreateUserDto
  ): Promise<UserDto> {
    return this.usersService.create(body); // Теперь ожидаем UserDto в ответе
  }

  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll(); // Возвращаем массив UserDto
  }
}
