import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardRowService {
  constructor(private prisma: PrismaService) {}

  async create(data: { boardId: string }) {
    // Сначала создаем строку
    const row = await this.prisma.boardRow.create({ data });

    // Находим все колонки у этого борда
    const columns = await this.prisma.boardColumn.findMany({
      where: { boardId: data.boardId },
    });

    // Создаем пустые ячейки под каждую колонку
    await this.prisma.boardCell.createMany({
      data: columns.map((column) => ({
        rowId: row.id,
        columnId: column.id,
        value: Prisma.JsonNull,
      })),
    });

    return row;
  }

  async delete(id: string) {
    return this.prisma.boardRow.delete({
      where: { id },
    });
  }
}
