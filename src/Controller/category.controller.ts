import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryCreateDTO } from 'src/DTO/Category/category.create.dto';
import { CategoryUpdateDTO } from 'src/DTO/Category/category.update.dto';
import { CategoryViewDTO } from 'src/DTO/Category/category.view.dto';

import { CategoryService } from 'src/Service/category.service';

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

  @Get('findId/:id')
  findId(@Param('id') id: string): Promise<CategoryViewDTO> {
    return this.categoryService.findId(id);
  }

  @Post()
  create(@Body() todo: CategoryCreateDTO) {
    return this.categoryService.create(todo);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string): Promise<CategoryViewDTO> {
    return this.categoryService.deleteOne(id);
  }

  @Patch(':id')
  updateID(
    @Param('id') id: string,
    @Body() todos: CategoryUpdateDTO,
  ): Promise<CategoryUpdateDTO> {
    return this.categoryService.findUpdateId(id, todos);
  }
}