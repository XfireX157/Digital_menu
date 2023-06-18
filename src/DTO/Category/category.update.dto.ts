import { PartialType } from '@nestjs/swagger';
import { CategoryCreateDTO } from './category.create.dto';

export class CategoryUpdateDTO extends PartialType(CategoryCreateDTO) {}
