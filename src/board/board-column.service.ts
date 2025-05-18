import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardColumnService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardColumnDto: CreateBoardColumnDto) {
    return this.prisma.$transaction(async (prisma) => {
      const column = await prisma.boardColumn.create({
        data: createBoardColumnDto,
      });

      const rows = await prisma.boardRow.findMany({
        where: { boardId: createBoardColumnDto.boardId },
      });

      await prisma.boardCell.createMany({
        data: rows.map((row) => ({
          rowId: row.id,
          columnId: column.id,
          value: Prisma.DbNull,
        })),
      });

      return column;
    });
  }

  async update(id: string, updateBoardColumnDto: UpdateBoardColumnDto) {
    return this.prisma.boardColumn.update({
      where: { id },
      data: updateBoardColumnDto,
    });
  }

  async delete(id: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.boardCell.deleteMany({
        where: { columnId: id },
      });

      return tx.boardColumn.delete({
        where: { id },
      });
    });
  }
}
