import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { BoardModule } from './board/board.module';

@Module({
  imports: [DbModule, AuthModule, UsersModule, BoardModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
