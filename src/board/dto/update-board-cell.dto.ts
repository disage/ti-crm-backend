import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateBoardCellDto {
  @ApiProperty({ description: 'Cell new value' })
  @IsOptional()
  value?: any;
}
