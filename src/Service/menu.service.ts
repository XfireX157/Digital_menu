import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MenuCreateDTO,
  MenuViewDTO,
  MenuUpdateDTO,
} from '../DTO/Menu/menu_create.dto';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { Menu } from '../Schema/menu.schema';
import { Model, Types } from 'mongoose';
import { CategoryService } from './category.service';
import { MenuPagineDTO } from '../DTO/Menu/menu_pagine.dto';
import { IMenuService } from 'src/Interface/IMenu.service';

@Injectable()
export class MenuService implements IMenuService {
  constructor(
    @InjectModel(Menu.name) private readonly menuModel: Model<Menu>,
    private readonly categoryModel: CategoryService,
  ) {}

  async findAll(menu: MenuPagineDTO): Promise<MenuViewDTO[]> {
    const { page = 0, pageSize = 10 } = menu;
    const findAll: Menu[] = await this.menuModel
      .find()
      .skip(page)
      .limit(pageSize)
      .exec();
    if (findAll.length === 0) {
      throw new ForbiddenException('Não existe nenhum menu criado', 204);
    }

    return findAll;
  }

  async search(name: string): Promise<MenuViewDTO[]> {
    const regex = new RegExp(name, 'i');
    return await this.menuModel.find({ name: regex }).exec();
  }

  async findId(_id: string): Promise<MenuViewDTO> {
    const findId = await this.menuModel
      .findOne({ _id: new Types.ObjectId(_id) })
      .exec();
    if (!findId) {
      throw new ForbiddenException('Não existe nenhum menu criado', 404);
    }
    return findId;
  }

  async create(file: Express.Multer.File, req: Request) {
    const menu: MenuCreateDTO = req.body as unknown as MenuCreateDTO;
    const category = await this.categoryModel.findName(menu.categoryName);

    const newMenu: Menu = {
      _id: new Types.ObjectId(),
      name: menu.name,
      description: menu.description,
      price: menu.price,
      image: file.filename,
      category: category,
    };

    return this.menuModel.create(newMenu);
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
