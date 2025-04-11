import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FolderType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({
    example: 'Project Docs',
    description: 'Folder name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Folder order index',
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    enum: FolderType,
    example: FolderType.shared,
    description: 'Folder type (private, public, shared)',
  })
  @IsEnum(FolderType)
  type: FolderType;

  @ApiPropertyOptional({
    example: ['e2f828d1-7727-4f7d-9c92-3644b5b4817b'],
    description: 'List of shared users IDs',
  })
  @IsArray()
  @IsOptional()
  visibleToUserIds?: string[];
}
