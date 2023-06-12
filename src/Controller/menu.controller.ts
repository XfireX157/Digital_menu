import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MenuCreateDTO } from 'src/DTO/Menu/menu_create.dto';
import { MenuUpdateDTO } from 'src/DTO/Menu/menu_update.dto';
import { MenuViewDTO } from 'src/DTO/Menu/menu_view.dto';
import { MenuService } from 'src/Service/menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async findAll(): Promise<MenuViewDTO[]> {
    return this.menuService.findAll();
  }

  @Get('findId/:id')
  getIdTodo(@Param('id') id: string): Promise<MenuViewDTO> {
    return this.menuService.findId(id);
  }

  @Get('search')
  filter(@Query('name') name: string): Promise<MenuViewDTO[]> {
    return this.menuService.filterMenu(name);
  }

  @Post()
  create(@Body() menu: MenuCreateDTO) {
    return this.menuService.create(menu);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<MenuViewDTO> {
    return this.menuService.deleteOne(id);
  }

  @Patch(':id')
  updateID(
    @Param('id') id: string,
    @Body() todos: MenuUpdateDTO,
  ): Promise<MenuUpdateDTO> {
    return this.menuService.findUpdateId(id, todos);
  }
}
