import { CategoryCreateDTO } from 'src/DTO/Category/category.create.dto';
import { CategoryUpdateDTO } from 'src/DTO/Category/category.update.dto';
import { CategoryViewDTO } from 'src/DTO/Category/category.view.dto';
import { Category } from 'src/Schema/category.schema';

export interface ICategoryService {
  findAll(): Promise<CategoryViewDTO[]>;
  findName(name: string): Promise<Category>;
  findId(id: string): Promise<CategoryViewDTO>;
  create(category: CategoryCreateDTO);
  deleteOne(id: string): Promise<CategoryViewDTO>;
  findUpdateId(id: string, menu: CategoryUpdateDTO): Promise<CategoryUpdateDTO>;
}
