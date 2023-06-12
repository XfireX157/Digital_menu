import { PartialType } from '@nestjs/mapped-types';
import { MenuCreateDTO } from './menu_create.dto';

export class MenuUpdateDTO extends PartialType(MenuCreateDTO) {}
