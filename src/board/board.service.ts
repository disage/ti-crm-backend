import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { CreateBoardDto } from './dto/сreate-board-dto';
import { FolderType } from '@prisma/client';

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

    return this.prisma.board.create({
      data: {
        name,
        icon,
        type,
        folderId: folderId ?? null,
        ownerId: userId,
      },
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
          orderBy: { createdAt: 'asc' },
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
      orderBy: { createdAt: 'asc' },
    });

    return {
      folders,
      topLevelBoards,
    };
  }

  async updateFolder(id: string, dto: UpdateFolderDto) {
    const { name, order, type, visibleToUserIds } = dto;

    return this.prisma.folder.update({
      where: { id },
      data: {
        name,
        order,
        type,
        visibleToUsers:
          type === FolderType.shared
            ? {
                set: visibleToUserIds?.map((id) => ({ id })) || [],
              }
            : { set: [] }, // clean if not shared
      },
    });
  }

  async delete(id: string) {
    return this.prisma.board.delete({ where: { id } });
  }

  async deleteFolder(id: string) {
    return this.prisma.folder.delete({ where: { id } });
  }
}
