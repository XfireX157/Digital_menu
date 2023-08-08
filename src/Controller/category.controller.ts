import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryCreateDTO } from '../DTO/Category/category.create.dto';
import { CategoryUpdateDTO } from '../DTO/Category/category.update.dto';
import { CategoryViewDTO } from '../DTO/Category/category.view.dto';
import { AuthGuard } from '../Guards/jwt.guard';
import { CategoryService } from '../Service/category.service';

@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<CategoryViewDTO[]> {
    return this.categoryService.findAll();
  }

  @Get('findName/:name')
  findName(@Param('name') name: string): Promise<CategoryViewDTO> {
    return this.categoryService.findName(name);
  }

  @UseGuards(AuthGuard)
  @Get('findId/:id')
  findId(@Param('id') id: string): Promise<CategoryViewDTO> {
    return this.categoryService.findId(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() todo: CategoryCreateDTO) {
    return this.categoryService.create(todo);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteTodo(@Param('id') id: string): Promise<CategoryViewDTO> {
    return this.categoryService.deleteOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateID(
    @Param('id') id: string,
    @Body() todos: CategoryUpdateDTO,
  ): Promise<CategoryUpdateDTO> {
    return this.categoryService.findUpdateId(id, todos);
  }
}
