import { PartialType } from '@nestjs/mapped-types';
import { MenuCreateDTO } from './menu_create.dto';

export class MenuViewDTO extends PartialType(MenuCreateDTO) {}
