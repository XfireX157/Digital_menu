import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { Menu } from '../Schema/menu.schema';
import { MenuService } from '../Service/menu.service';
import { CategoryService } from '../Service/category.service';
import { MenuPagineDTO } from '../DTO/Menu/menu_pagine.dto';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { menu } from './Mock/MenuMock';
import { MenuUpdateDTO } from 'src/DTO/Menu/menu_create.dto';

describe('MenuService', () => {
  let menuService: MenuService;
  let menuModel: Model<Menu>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        CategoryService,
        {
          provide: getModelToken(Menu.name),
          useValue: {
            new: jest.fn().mockImplementation((data) => data),

            // ... other mock functions ...

            // Add a mock implementation for the `save` method if needed
            save: jest.fn().mockResolvedValue({}),

            find: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              exec: jest.fn().mockReturnValue(menu),
            }),
            findOne: jest.fn(),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce(menu[0]),
            }),
            create: jest.fn().mockResolvedValue({}),
            deleteOne: jest.fn(),
            findByIdAndUpdate: jest.fn().mockReturnValueOnce({
              exec: jest.fn().mockResolvedValueOnce(menu[0]),
            }),
          }, // Pode ser um objeto vazio, já que não estamos executando testes relacionados ao Mongoose aqui.
        },
        {
          provide: CategoryService,
          useValue: {
            findName: jest.fn().mockResolvedValue({
              _id: new Types.ObjectId(),
              name: 'Category Name',
            }),
          },
        },
      ],
    }).compile();

    menuService = module.get<MenuService>(MenuService);
    categoryService = module.get<CategoryService>(CategoryService);
    menuModel = module.get<Model<Menu>>(getModelToken(Menu.name));
  });

  it('Should be defined', () => {
    expect(menuService).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(menuModel).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of menu', async () => {
      const menuPagine: MenuPagineDTO = { page: 0, pageSize: 10 };

      const result = await menuService.findAll(menuPagine);
      expect(result).toEqual(menu);
    });

    it('should return an exception of menu', async () => {
      const menuPagine: MenuPagineDTO = { page: 0, pageSize: 10 };

      jest.spyOn(menuModel, 'find').mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce([]),
      } as any);

      expect(menuService.findAll(menuPagine)).rejects.toThrowError(
        new ForbiddenException('Não existe nenhum menu criado', 204),
      );
    });
  });

  describe('search', () => {
    it('I hope it returns the searched products', async () => {
      const categoryName = 'jantar';

      const result = await menuService.search(categoryName);
      expect(menuModel.find).toHaveBeenCalledWith({ name: expect.any(RegExp) });
      expect(menuModel.find).toHaveBeenCalledWith({
        name: expect.objectContaining({ source: categoryName, flags: 'i' }),
      });
      expect(result).toEqual(menu);
    });
  });

  describe('findId', () => {
    it('should return an array of menu', async () => {
      const categoryId = new Types.ObjectId().toString();

      jest.spyOn(menuModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(menu[0]),
      } as any);

      const result = await menuService.findId(categoryId);
      expect(result).toEqual(menu[0]);
    });
    it('should return an exception of menu', async () => {
      const categoryId = new Types.ObjectId().toString();
      jest.spyOn(menuModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      expect(menuService.findId(categoryId)).rejects.toThrowError(
        new ForbiddenException('Não existe nenhum menu criado', 404),
      );
    });
  });

  // describe('create', () => {
  //   it('should create a new menu', async () => {
  //     // Arrange
  //     const file: Express.Multer.File = {
  //       fieldname: 'file',
  //       originalname: 'menu-image.png',
  //       encoding: '7bit',
  //       mimetype: 'image/png',
  //       destination: './uploads/',
  //       filename: 'menu-image.png',
  //       path: './uploads/menu-image.png',
  //       size: 1024,
  //     };
  //     const req = {
  //       body: {
  //         name: 'New Menu',
  //         description: 'A new menu item',
  //         price: 12.99,
  //         categoryName: 'New Category',
  //       },
  //     };

  //     const menuId = new Types.ObjectId().toString();
  //     const category = {
  //       _id: new Types.ObjectId(),
  //       name: 'New Category',
  //     };

  //     // Mock the category service's findName method
  //     jest.spyOn(categoryService, 'findName').mockResolvedValue(category);

  //     // Mock the save method of the menuModel
  //     jest.spyOn(menuModel.prototype, 'save').mockResolvedValue({
  //       _id: menuId,
  //       ...req.body,
  //       image: file.filename,
  //       category,
  //     });

  //     // Act
  //     const createdMenu = await menuService.create(file, req);

  //     // Assert
  //     expect(categoryService.findName).toHaveBeenCalledWith('New Category');
  //     expect(menuModel.prototype.save).toHaveBeenCalledWith();
  //     expect(createdMenu).toEqual({
  //       _id: menuId,
  //       ...req.body,
  //       image: file.filename,
  //       category,
  //     });
  //   });
  // });

  describe('delete', () => {
    it('delete this object by id', async () => {
      const menuId = '12345';

      jest.spyOn(menuService, 'findId').mockResolvedValueOnce(menu[0]);
      jest.spyOn(menuModel, 'deleteOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({}),
      } as any);

      const result = await menuService.deleteOne(menuId);

      expect(result).toEqual(menu[0]);
    });
  });

  describe('updateId', () => {
    it('hope to create a menu', async () => {
      const menuId = '12345';
      const updateMenu: MenuUpdateDTO = {
        name: 'Update Menu',
        categoryName: 'Update CategoryName',
        description: 'Update Description',
        image: 'Update Image',
        price: 22.0,
      };

      jest.spyOn(menuService, 'findId').mockResolvedValueOnce(menu[0]);

      const result = await menuService.findUpdateId(menuId, updateMenu);

      expect(result).toEqual(menu[0]);
    });
  });
});
