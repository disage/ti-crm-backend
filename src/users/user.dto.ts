import { IsString, IsEmail } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsString()
  createdAt: Date; // В этом случае, возможно, вам нужно будет преобразовать дату в строку
}
