import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(['admin', 'user']) // Ограничем роль до admin/user
  role?: string; // role может быть опциональным
}
