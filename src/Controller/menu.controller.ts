import { Controller, Get } from '@nestjs/common';
import { Menu } from 'src/Schema/menu.schema';
import { MenuService } from 'src/Service/menu.service';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getHello(): Promise<Menu[]> {
    return this.menuService.findAll();
  }
}
