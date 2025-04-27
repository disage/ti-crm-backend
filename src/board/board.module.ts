import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BoardCellService } from './board-cell.service';
import { BoardColumnService } from './board-column.service';
import { BoardRowService } from './board-row.service';
import { BoardCellController } from './board-cell.controller';
import { BoardColumnController } from './board-column.controller';
import { BoardRowController } from './board-row.controller';

@Module({
  controllers: [
    BoardController,
    BoardCellController,
    BoardColumnController,
    BoardRowController,
  ],
  exports: [BoardService],
  providers: [
    BoardService,
    PrismaService,
    BoardRowService,
    BoardColumnService,
    BoardCellService,
  ],
})
export class BoardModule {}
