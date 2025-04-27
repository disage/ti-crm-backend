import { IsOptional, IsString, IsInt, IsObject } from 'class-validator';

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
}
