import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardCellDto } from './dto/create-board-cell.dto';
import { UpdateBoardCellDto } from './dto/update-board-cell.dto';

@Injectable()
export class BoardCellService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardCellDto: CreateBoardCellDto) {
    return this.prisma.boardCell.create({
      data: createBoardCellDto,
    });
  }

  async update(id: string, updateBoardCellDto: UpdateBoardCellDto) {
    return this.prisma.boardCell.update({
      where: { id },
      data: updateBoardCellDto,
    });
  }
}
