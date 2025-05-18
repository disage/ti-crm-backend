import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardRowService {
  constructor(private prisma: PrismaService) {}

  async create(data: { boardId: string }) {
    const row = await this.prisma.boardRow.create({ data });

    const columns = await this.prisma.boardColumn.findMany({
      where: { boardId: data.boardId },
    });

    const cells = await Promise.all(
      columns.map((column) =>
        this.prisma.boardCell.create({
          data: {
            rowId: row.id,
            columnId: column.id,
            value: Prisma.JsonNull,
          },
        }),
      ),
    );

    return {
      ...row,
      cells,
    };
  }

  async delete(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.boardCell.deleteMany({
        where: { rowId: id },
      });

      return prisma.boardRow.delete({
        where: { id },
      });
    });
  }
}
