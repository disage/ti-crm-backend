import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  // @ApiPropertyOptional({
  //   example: 'user',
  //   description: 'Role (admin or user)',
  // })
  // @IsString()
  // @IsIn(['admin', 'user'])
  // role?: string;
}
