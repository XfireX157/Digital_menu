import { PartialType } from '@nestjs/swagger';
import { MenuCreateDTO } from './menu_create.dto';

export class MenuViewDTO extends PartialType(MenuCreateDTO) {}
