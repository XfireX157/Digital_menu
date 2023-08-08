import { Model } from 'mongoose';
import { Category } from '../Schema/category.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../Service/category.service';
import { getModelToken } from '@nestjs/mongoose';
import { CategoryViewDTO } from '../DTO/Category/category.view.dto';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { CategoryUpdateDTO } from '../DTO/Category/category.update.dto';
import { CategoryController } from '../Controller/category.controller';
import { JwtService } from '@nestjs/jwt';

const categories: CategoryViewDTO[] = [
  { name: 'Category 1' },
  { name: 'Category 2' },
];

describe('CategoryService', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;
  let categoryModel: Model<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        JwtService,
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: {
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockReturnValue(categories),
            }),
            findOne: jest.fn(),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce(categories[0]),
            }),
            create: jest.fn(),
            deleteOne: jest.fn().mockReturnValueOnce({
              exec: jest.fn().mockResolvedValueOnce({}),
            }),
            findByIdAndUpdate: jest.fn().mockReturnValueOnce({
              exec: jest.fn().mockResolvedValueOnce(categories[0]),
            }),
          },
        },
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));
  });

  it('Should be defined', () => {
    expect(categoryController).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(categoryModel).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = await categoryService.findAll();

      expect(result).toEqual(categories);
    });

    it('should return an exception', () => {
      jest.spyOn(categoryModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([]),
      } as any);

      expect(categoryService.findAll()).rejects.toThrowError(
        new ForbiddenException('Não existe nenhuma categoria criada', 204),
      );
    });
  });

  describe('findName', () => {
    it('should return an name category', async () => {
      const category: Category = { name: 'Category 1' };
      jest.spyOn(categoryModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(category),
      } as any);

      const result = await categoryService.findName(category.name);
      expect(result).toEqual(category);
    });

    it('should return an exception', async () => {
      const categoryName = 'category-not-Eixst';

      jest.spyOn(categoryModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      expect(categoryService.findName(categoryName)).rejects.toThrowError(
        new ForbiddenException('Essa categoria não existe', 409),
      );
    });
  });

  describe('findId', () => {
    it('should return a category with the given id', async () => {
      const categoryId = '12345';

      const result = await categoryService.findId(categoryId);
      expect(result).toEqual(categories[0]);
    });
    it('should throw a not found exception', async () => {
      const categoryId = '12345';
      jest.spyOn(categoryModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(categoryService.findId(categoryId)).rejects.toThrowError(
        new ForbiddenException('O id da categoria não existe', 409),
      );
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const data = {
        name: 'Café',
      };

      (categoryModel.create as jest.Mock).mockResolvedValueOnce(categories[0]);
      const result = await categoryService.create(data);

      expect(result).toEqual(categories[0]);
    });

    it('It should warn that this category already exists', async () => {
      const data = {
        name: 'Café',
      };

      jest.spyOn(categoryModel, 'findOne').mockResolvedValueOnce(data);

      expect(categoryService.create(data)).rejects.toThrow(
        new ForbiddenException('Essa categoria já existe', 409),
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a category with the given id', async () => {
      const categoryId = '12345';
      const category: Category = { name: 'Category 1' };
      jest.spyOn(categoryService, 'findId').mockResolvedValueOnce(category);

      const result = await categoryService.deleteOne(categoryId);

      expect(result).toEqual(category);
    });
  });
  describe('findUpdateId', () => {
    it('should update a category with the given id', async () => {
      const categoryId = '12345';
      const categoryUpdateDTO: CategoryUpdateDTO = { name: 'Updated Category' };
      const category: Category = { name: 'Category 1' };
      jest.spyOn(categoryService, 'findId').mockResolvedValueOnce(category);

      const result = await categoryService.findUpdateId(
        categoryId,
        categoryUpdateDTO,
      );

      expect(result).toEqual(category);
    });
  });
});
