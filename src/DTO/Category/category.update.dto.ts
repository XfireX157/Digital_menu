import { PartialType } from '@nestjs/mapped-types';
import { CategoryCreateDTO } from './category.create.dto';

export class CategoryUpdateDTO extends PartialType(CategoryCreateDTO) {}
