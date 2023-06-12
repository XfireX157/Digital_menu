import { PartialType } from '@nestjs/mapped-types';
import { CategoryCreateDTO } from './category.create.dto';

export class CategoryViewDTO extends PartialType(CategoryCreateDTO) {}
