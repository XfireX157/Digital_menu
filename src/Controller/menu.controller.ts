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
  Req,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MenuPagineDTO } from '../DTO/Menu/menu_pagine.dto';
import { Roles } from '../Decorator/roles.decorator';
import { Role } from '../Enum/Role.enum';
import { AuthGuard } from '../Guards/jwt.guard';
import { RolesGuard } from '../Guards/roles.guard';
import { multerConfig } from '../Middleware/multer_config';
import { MenuService } from '../Service/menu.service';
import { MenuUpdateDTO, MenuViewDTO } from 'src/DTO/Menu/menu_create.dto';

@ApiBearerAuth()
@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('findAll')
  @ApiOperation({ summary: 'Obter todos os menus' })
  @ApiResponse({
    status: 200,
    description: 'Menus encontrados com sucesso',
    type: [MenuViewDTO],
  })
  @ApiResponse({ status: 201, description: 'Menus não encontrados' })
  async findAll(@Query() menu: MenuPagineDTO): Promise<MenuViewDTO[]> {
    return this.menuService.findAll(menu);
  }

  @Get('findId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtém o objeto correspondente ao id' })
  @ApiResponse({
    status: 200,
    description: 'Menu encontrado com sucesso',
    type: [MenuViewDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Esse id não existe para esse menus',
  })
  @ApiResponse({ status: 404, description: 'Menu não encontrado' })
  getIdTodo(@Query('id') id: string): Promise<MenuViewDTO> {
    return this.menuService.findId(id);
  }

  @Get('search')
  search(@Query('name') name: string): Promise<MenuViewDTO[]> {
    return this.menuService.search(name);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Criar um novo menu' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Menu criado com sucesso',
    type: [MenuViewDTO],
  })
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.menuService.create(file, req);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete um menu' })
  @ApiResponse({
    status: 204,
    description: 'Menu deletado com sucesso',
    type: [MenuViewDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Esse id não corresponde a nenhum menu',
    type: [MenuViewDTO],
  })
  delete(@Param('id') id: string): Promise<MenuViewDTO> {
    return this.menuService.deleteOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Atualiza um menu' })
  @ApiResponse({
    status: 201,
    description: 'Menu atualizado com sucesso',
    type: [MenuViewDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Esse id não corresponde a nenhum menu',
    type: [MenuViewDTO],
  })
  updateID(
    @Param('id') id: string,
    @Body() todos: MenuUpdateDTO,
  ): Promise<MenuUpdateDTO> {
    return this.menuService.findUpdateId(id, todos);
  }
}
