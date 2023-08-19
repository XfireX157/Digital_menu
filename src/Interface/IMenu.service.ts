import { MenuUpdateDTO, MenuViewDTO } from 'src/DTO/Menu/menu_create.dto';
import { MenuPagineDTO } from 'src/DTO/Menu/menu_pagine.dto';

export interface IMenuService {
  findAll(menu: MenuPagineDTO): Promise<MenuViewDTO[]>;
  search(name: string): Promise<MenuViewDTO[]>;
  findId(_id: string): Promise<MenuViewDTO>;
  create(file: Express.Multer.File, req: Request);
  deleteOne(id: string): Promise<MenuViewDTO>;
  findUpdateId(id: string, menu: MenuUpdateDTO): Promise<MenuUpdateDTO>;
}
