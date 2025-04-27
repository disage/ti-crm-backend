import { IsString, IsOptional, IsEnum, IsInt, IsObject } from 'class-validator';
import { ColumnType } from '@prisma/client';

export class CreateBoardColumnDto {
  @IsString()
  boardId: string;

  @IsString()
  name: string;

  @IsEnum(ColumnType)
  type: ColumnType;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsObject()
  settings?: object;
}
