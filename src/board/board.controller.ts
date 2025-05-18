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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { BoardService } from './board.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateBoardDto } from './dto/сreate-board-dto';
import { UpdateBoardDto } from './dto/update-board.dto';

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update board' })
  @ApiResponse({ status: 200, description: 'Board successfully updated.' })
  updateBoard(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardService.updateBoard(id, dto);
  }

  @Patch('folder/:id')
  @UseGuards(JwtAuthGuard)
  updateFolder(@Param('id') id: string, @Body() dto: UpdateFolderDto) {
    return this.boardService.updateFolder(id, dto);
  }

  @Patch('move/:id')
  @UseGuards(JwtAuthGuard)
  updateBoardFolder(
    @Param('id') id: string,
    @Body() dto: { folderId: string | null; order: number },
  ) {
    return this.boardService.updateBoardFolder(id, dto.folderId, dto.order);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeBoard(@Param('id') id: string) {
    return this.boardService.deleteBoard(id);
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get board data',
  })
  @ApiResponse({ status: 200, description: 'Борд успешно получен.' })
  async getBoard(@Param('id') id: string) {
    return this.boardService.getBoardById(id);
  }
}
