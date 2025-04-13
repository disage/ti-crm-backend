import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FolderType } from '@prisma/client';

export class CreateBoardDto {
  @IsString()
  name: string;

  @IsString()
  icon?: string;

  @IsEnum(FolderType)
  type: FolderType;

  @IsOptional()
  @IsString()
  folderId?: string;
}
