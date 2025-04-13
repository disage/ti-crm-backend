import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { BoardService } from './board.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateBoardDto } from './dto/сreate-board-dto';

@ApiTags('boards')
@ApiBearerAuth()
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('folder')
  @UseGuards(JwtAuthGuard)
  createFolder(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateFolderDto,
  ) {
    return this.boardService.createFolder(dto, user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createBoard(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateBoardDto,
  ) {
    return this.boardService.createBoard(dto, user.userId);
  }

  @Patch('folder/:id')
  @UseGuards(JwtAuthGuard)
  updateFolder(@Param('id') id: string, @Body() dto: UpdateFolderDto) {
    return this.boardService.updateFolder(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.boardService.delete(id);
  }

  @Delete('folder/:id')
  @UseGuards(JwtAuthGuard)
  removeFolder(@Param('id') id: string) {
    return this.boardService.deleteFolder(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAvailable(@CurrentUser() user: { userId: string }) {
    return this.boardService.getAvailableFolders(user.userId);
  }
}
