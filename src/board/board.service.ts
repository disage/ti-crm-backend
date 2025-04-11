import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

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

  async getAvailableFolders(userId: string) {
    return this.prisma.folder.findMany({
      where: {
        OR: [
          { type: 'public' },
          { type: 'private', ownerId: userId },
          {
            type: 'shared',
            visibleToUsers: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
      orderBy: {
        order: 'asc',
      },
    });
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
          type === 'shared'
            ? {
                set: visibleToUserIds?.map((id) => ({ id })) || [],
              }
            : { set: [] }, // clean if not shared
      },
    });
  }

  async delete(id: string) {
    return this.prisma.folder.delete({ where: { id } });
  }

  async deleteFolder(id: string) {
    return this.prisma.folder.delete({ where: { id } });
  }
}
