import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { BoardCellService } from './board-cell.service';
import { CreateBoardCellDto } from './dto/create-board-cell.dto';
import { UpdateBoardCellDto } from './dto/update-board-cell.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('cells')
@Controller('board/cell')
export class BoardCellController {
  constructor(private readonly boardCellService: BoardCellService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new cell' })
  @ApiResponse({
    status: 201,
    description: 'Ячейка успешно создана.',
  })
  create(@Body() createBoardCellDto: CreateBoardCellDto) {
    return this.boardCellService.create(createBoardCellDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update cell value' })
  @ApiResponse({
    status: 200,
    description: 'Ячейка успешно обновлена.',
  })
  update(
    @Param('id') id: string,
    @Body() updateBoardCellDto: UpdateBoardCellDto,
  ) {
    return this.boardCellService.update(id, updateBoardCellDto);
  }
}
