import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateBoardCellDto {
  @ApiProperty({ description: 'Row ID' })
  @IsString()
  rowId: string;

  @ApiProperty({ description: 'Column ID' })
  @IsString()
  columnId: string;

  @ApiProperty({ description: 'Cell value', required: false })
  @IsOptional()
  value?: any;
}
