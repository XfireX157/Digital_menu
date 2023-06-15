import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MenuCreateDTO } from 'src/DTO/Menu/menu_create.dto';
import { MenuUpdateDTO } from 'src/DTO/Menu/menu_update.dto';
import { MenuViewDTO } from 'src/DTO/Menu/menu_view.dto';
import { ForbiddenException } from 'src/Exception/forbidden.exception';
import { Menu } from 'src/Schema/menu.schema';
import { Model } from 'mongoose';
import { CategoryService } from './category.service';
import { MenuPagineDTO } from 'src/DTO/Menu/menu_pagine.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name) private readonly menuModel: Model<Menu>,
    private readonly categoryModel: CategoryService,
  ) {}

  async findAll(menu: MenuPagineDTO): Promise<MenuViewDTO[]> {
    const { page = 0, pageSize = 10 } = menu;
    const findAll = await this.menuModel
      .find()
      .skip(page)
      .limit(pageSize)
      .exec();
    if (findAll.length === 0) {
      throw new ForbiddenException('Não existe nenhuma categoria criada', 204);
    }
    return findAll;
  }

  async filterMenu(name: string): Promise<MenuViewDTO[]> {
    const regex = new RegExp(name, 'i');
    return await this.menuModel.find({ name: regex }).exec();
  }

  async findId(id: string): Promise<Menu> {
    const findId = await this.menuModel.findById(id).exec();
    if (!findId) {
      throw new ForbiddenException('Não existe nenhuma categoria criada', 404);
    }
    return findId;
  }

  async create(menu: MenuCreateDTO) {
    const newMenu = new this.menuModel(menu);
    const category = await this.categoryModel.findName(menu.categoryName);
    newMenu.category = category;
    return newMenu.save();
  }

  async deleteOne(id: string): Promise<MenuViewDTO> {
    const findId = await this.findId(id);
    await this.menuModel.deleteOne({ _id: id }).exec();
    return findId;
  }

  async findUpdateId(id: string, menu: MenuUpdateDTO): Promise<MenuUpdateDTO> {
    const findId = await this.findId(id);
    await this.menuModel.findByIdAndUpdate({ _id: id }, menu).exec();
    return findId;
  }
}
