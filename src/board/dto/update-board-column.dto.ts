import { ColumnType } from '@prisma/client';
import { IsOptional, IsString, IsInt, IsObject, IsEnum } from 'class-validator';

export class UpdateBoardColumnDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsObject()
  settings?: object;

  @IsOptional()
  @IsEnum(ColumnType)
  type?: ColumnType;
}
