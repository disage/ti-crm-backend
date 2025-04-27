import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BoardRowService } from './board-row.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('board/row')
export class BoardRowController {
  constructor(private readonly boardRowService: BoardRowService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: { boardId: string }) {
    return this.boardRowService.create(body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.boardRowService.delete(id);
  }
}
