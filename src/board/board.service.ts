import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { CreateBoardDto } from './dto/сreate-board-dto';
import { FolderType } from '@prisma/client';
import { ColumnType } from '@prisma/client'; // обязательно импорт!
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async createFolder(dto: CreateFolderDto, userId: string) {
    const { name, order, type, visibleToUserIds } = dto;

    return this.prisma.folder.create({
      data: {
        name,
        order,
        type,
        ownerId: userId,
        visibleToUsers:
          type === 'shared'
            ? {
                connect: visibleToUserIds?.map((id) => ({ id })),
              }
            : undefined,
      },
    });
  }

  async createBoard(dto: CreateBoardDto, userId: string) {
    const { name, icon, type, folderId } = dto;

    if (folderId) {
      const folder = await this.prisma.folder.findFirst({
        where: {
          id: folderId,
          OR: [
            { ownerId: userId },
            { visibleToUsers: { some: { id: userId } } },
          ],
        },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found or access denied');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Создаем сам борд
      const board = await tx.board.create({
        data: {
          name,
          icon,
          type,
          folderId: folderId ?? null,
          ownerId: userId,
        },
      });

      // 2. Создаем дефолтную колонку "Name"
      const column = await tx.boardColumn.create({
        data: {
          boardId: board.id,
          name: 'Name',
          type: ColumnType.TEXT,
          order: 0,
        },
      });

      // 3. Создаем дефолтную строку
      const row = await tx.boardRow.create({
        data: {
          boardId: board.id,
        },
      });

      // 4. Создаем ячейку со значением "Alex"
      await tx.boardCell.create({
        data: {
          rowId: row.id,
          columnId: column.id,
          value: 'Alex',
        },
      });

      return board;
    });
  }

  async getAvailableFolders(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isAdmin = user?.role === 'admin';

    const folderWhere = isAdmin
      ? undefined
      : {
          OR: [
            { type: FolderType.public },
            { type: FolderType.private, ownerId: userId },
            {
              type: FolderType.shared,
              visibleToUsers: {
                some: {
                  id: userId,
                },
              },
            },
          ],
        };

    const folders = await this.prisma.folder.findMany({
      where: folderWhere,
      orderBy: { order: 'asc' },
      include: {
        boards: {
          where: isAdmin
            ? undefined
            : {
                OR: [
                  { type: FolderType.public },
                  { type: FolderType.private, ownerId: userId },
                  {
                    type: FolderType.shared,
                    visibleToUsers: {
                      some: {
                        id: userId,
                      },
                    },
                  },
                ],
              },
          orderBy: { order: 'asc' },
        },
      },
    });

    const topLevelBoards = await this.prisma.board.findMany({
      where: {
        folderId: null,
        ...(isAdmin
          ? {}
          : {
              OR: [
                { type: FolderType.public },
                { type: FolderType.private, ownerId: userId },
                {
                  type: FolderType.shared,
                  visibleToUsers: {
                    some: {
                      id: userId,
                    },
                  },
                },
              ],
            }),
      },
      orderBy: { order: 'asc' },
    });

    return {
      folders,
      topLevelBoards,
    };
  }

  async updateBoardFolder(
    boardId: string,
    folderId: string | null,
    newOrder: number,
  ) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) throw new Error('Board not found');

    // get all boards in the same folder (or in the root), excluding the current one
    const siblingBoards = await this.prisma.board.findMany({
      where: {
        folderId,
        id: { not: boardId },
      },
      orderBy: { order: 'asc' },
    });

    // Insert the current board into the desired position and recalculate the order
    const updatedBoards = [
      ...siblingBoards.slice(0, newOrder),
      board,
      ...siblingBoards.slice(newOrder),
    ];

    await Promise.all(
      updatedBoards.map((b, index) =>
        this.prisma.board.update({
          where: { id: b.id },
          data: {
            order: index,
            ...(b.id === boardId ? { folderId } : {}), // update folderId only for the board being moved
          },
        }),
      ),
    );

    return { success: true };
  }

  async updateFolder(id: string, dto: UpdateFolderDto) {
    const { name, order, type, visibleToUserIds } = dto;

    return this.prisma.folder.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(order !== undefined && { order }),
        type,
        visibleToUsers:
          type === FolderType.shared
            ? {
                set: visibleToUserIds?.map((id) => ({ id })) || [],
              }
            : { set: [] }, // clear, if not shared
      },
    });
  }

  async updateBoard(id: string, dto: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id },
      data: dto,
    });
  }

  async deleteBoard(id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: {
        rows: {
          include: {
            cells: true, // ячейки, связанные с каждой строкой
          },
        },
        columns: true, // колонки, связанные с бордом
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Удаление ячеек
    for (const row of board.rows) {
      await this.prisma.boardCell.deleteMany({
        where: { rowId: row.id },
      });
    }

    // Удаление строк
    await this.prisma.boardRow.deleteMany({
      where: { boardId: id },
    });

    // Удаление колонок
    await this.prisma.boardColumn.deleteMany({
      where: { boardId: id },
    });

    // Удаление самого борда
    return this.prisma.board.delete({
      where: { id },
    });
  }

  async deleteFolder(id: string) {
    await this.prisma.board.deleteMany({
      where: {
        folderId: id,
      },
    });
    return this.prisma.folder.delete({
      where: {
        id,
      },
    });
  }

  async getBoardById(id: string) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { order: 'asc' },
        },
        rows: {
          include: {
            cells: true,
          },
        },
      },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    const columns = board.columns.map((column) => ({
      id: column.id,
      name: column.name,
      type: column.type,
      order: column.order,
      settings: column.settings,
    }));

    const rows = board.rows.map((row) => {
      const rowData: any = { id: row.id };

      row.cells.forEach((cell) => {
        const column = board.columns.find((col) => col.id === cell.columnId);
        if (column) {
          rowData[column.name] = {
            value: cell.value,
            cellId: cell.id,
          };
        }
      });

      return rowData;
    });

    return {
      id: board.id,
      name: board.name,
      columns,
      rows,
    };
  }
}
