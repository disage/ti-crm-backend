import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { BoardColumnService } from './board-column.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { UpdateBoardColumnDto } from './dto/update-board-column.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('columns')
@Controller('board/column')
export class BoardColumnController {
  constructor(private readonly boardColumnService: BoardColumnService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new column' })
  @ApiResponse({
    status: 201,
    description: 'Column has been created successfully.',
  })
  async create(@Body() createBoardColumnDto: CreateBoardColumnDto) {
    // Преобразуем тело запроса в экземпляр класса DTO
    const dtoInstance = plainToClass(
      CreateBoardColumnDto,
      createBoardColumnDto,
    );

    // Валидируем данные
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    // Создаём колонку
    return this.boardColumnService.create(createBoardColumnDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update column' })
  @ApiResponse({
    status: 200,
    description: 'Column has been updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateBoardColumnDto: UpdateBoardColumnDto,
  ) {
    return this.boardColumnService.update(id, updateBoardColumnDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete column' })
  @ApiResponse({
    status: 200,
    description: 'Column has been successfully removed',
  })
  delete(@Param('id') id: string) {
    return this.boardColumnService.delete(id);
  }
}
