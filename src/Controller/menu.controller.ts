import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { Req, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MenuPagineDTO } from 'src/DTO/Menu/menu_pagine.dto';
import { MenuUpdateDTO } from 'src/DTO/Menu/menu_update.dto';
import { MenuViewDTO } from 'src/DTO/Menu/menu_view.dto';
import { Roles } from 'src/Decorator/roles.decorator';
import { Role } from 'src/Enum/Role.enum';
import { AuthGuard } from 'src/Guards/jwt.guard';
import { RolesGuard } from 'src/Guards/roles.guard';
import { multerConfig } from 'src/Middleware/multer_config';
import { MenuService } from 'src/Service/menu.service';

@ApiBearerAuth()
@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('findAll')
  async findAll(@Query() menu: MenuPagineDTO): Promise<MenuViewDTO[]> {
    return this.menuService.findAll(menu);
  }

  @UseGuards(AuthGuard)
  @Get('findId/:id')
  getIdTodo(@Param('id') id: string): Promise<MenuViewDTO> {
    return this.menuService.findId(id);
  }

  @Get('search')
  filter(@Query('name') name: string): Promise<MenuViewDTO[]> {
    return this.menuService.filterMenu(name);
  }
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Post()
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.menuService.create(file, req);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<MenuViewDTO> {
    return this.menuService.deleteOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  updateID(
    @Param('id') id: string,
    @Body() todos: MenuUpdateDTO,
  ): Promise<MenuUpdateDTO> {
    return this.menuService.findUpdateId(id, todos);
  }
}
