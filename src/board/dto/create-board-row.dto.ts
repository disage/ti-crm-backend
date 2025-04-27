import { IsString } from 'class-validator';

export class CreateBoardRowDto {
  @IsString()
  boardId: string;
}
