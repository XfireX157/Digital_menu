import { PartialType } from '@nestjs/swagger';
import { MenuCreateDTO } from './menu_create.dto';

export class MenuUpdateDTO extends PartialType(MenuCreateDTO) {}
