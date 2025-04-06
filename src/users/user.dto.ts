import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: 'user ID' })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user', description: 'user role' })
  @IsString()
  role: string;

  @IsString()
  createdAt: Date;

  @ApiProperty({ example: 'User Name', description: 'user name' })
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: 'user image URL',
  })
  imgUrl?: string;
}
