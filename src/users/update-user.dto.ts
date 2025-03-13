import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional() // Поле не обязательно для обновления
  email?: string;

  @IsString()
  @IsOptional() // Поле не обязательно для обновления
  password?: string;

  @IsString()
  @IsOptional() // Поле не обязательно для обновления
  @IsIn(['admin', 'user'])
  role?: string; // role может быть опциональным
}
