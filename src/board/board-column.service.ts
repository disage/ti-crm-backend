import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';

@Injectable()
export class BoardColumnService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardColumnDto: CreateBoardColumnDto) {
    return this.prisma.boardColumn.create({
      data: createBoardColumnDto,
    });
  }

  async update(id: string, updateBoardColumnDto: UpdateBoardColumnDto) {
    return this.prisma.boardColumn.update({
      where: { id },
      data: updateBoardColumnDto,
    });
  }

  async delete(id: string) {
    return this.prisma.boardColumn.delete({
      where: { id },
    });
  }
}
