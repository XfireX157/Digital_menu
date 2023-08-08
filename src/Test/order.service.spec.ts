import { Model } from 'mongoose';
import { OrderService } from '../Service/order.service';
import { Order } from '../Schema/order.schema';
import { MenuService } from '../Service/menu.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OrderPagineDTO } from '../DTO/Order/order_pagine.dto';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { order } from './Mock/OrderMock';
import { TableService } from '../Service/table.service';
import { Menu } from '../Schema/menu.schema';
import { CategoryService } from '../Service/category.service';
import { Table } from '../Schema/table.shema';
import { Category } from '../Schema/category.schema';
import { Types } from 'mongoose';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderModel: Model<Order>;
  let menuModel: Model<Menu>;
  let tableModel: Model<Table>;
  let categoryModel: Model<Category>; // Add the category model
  let menuService: MenuService;
  let tableService: TableService;
  let categoryService: CategoryService; // Add the category service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        MenuService,
        TableService,
        CategoryService, // Add the category service to the providers
        {
          provide: getModelToken(Order.name),
          useValue: {
            find: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              exec: jest.fn().mockReturnValue(order),
            } as any),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValueOnce(order[0]),
            }),
          },
        },
        {
          provide: getModelToken(Menu.name),
          useValue: {
            // Mock any relevant methods or provide dummy data if needed
          },
        },
        {
          provide: getModelToken(Table.name),
          useValue: {
            // Mock any relevant methods or provide dummy data if needed
          },
        },
        {
          provide: getModelToken(Category.name), // Provide the Category model
          useValue: {
            // Mock any relevant methods or provide dummy data if needed
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderModel = module.get<Model<Order>>(getModelToken(Order.name));
    menuModel = module.get<Model<Menu>>(getModelToken(Menu.name));
    tableModel = module.get<Model<Table>>(getModelToken(Table.name));
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name)); // Get the Category model
    menuService = module.get<MenuService>(MenuService);
    tableService = module.get<TableService>(TableService);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('Should be defined', () => {
    expect(orderService).toBeDefined();
    expect(orderModel).toBeDefined();
    expect(menuModel).toBeDefined();
    expect(tableModel).toBeDefined();
    expect(categoryModel).toBeDefined();
    expect(menuService).toBeDefined();
    expect(tableService).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  describe('findAll', () => {
    it('I hope I return the orders', async () => {
      const pagine: OrderPagineDTO = { page: 0, pageSize: 10 };

      const result = await orderService.findAll(pagine);
      expect(result).toEqual(order);
    });
    it('I hope I return the excepiton orders', async () => {
      const pagine: OrderPagineDTO = { page: 0, pageSize: 10 };
      jest.spyOn(orderModel, 'find').mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockReturnValue([]),
      } as any);
      expect(orderService.findAll(pagine)).rejects.toThrowError(
        new ForbiddenException('Não existe nenhuma ordem de pedido', 204),
      );
    });
  });
  describe('findByOrder', () => {
    it('I hope to return the order id', async () => {
      const _id = '1234567';

      const result = await orderService.findByOrder(_id);
      expect(result).toEqual(order[0]);
    });

    it('I hope to return the order id', async () => {
      const orderNumbers = new Types.ObjectId().toString();
      jest.spyOn(orderModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      expect(orderService.findByOrder(orderNumbers)).rejects.toThrowError(
        new ForbiddenException('Essa ordem de pedido não existe', 204),
      );
    });
  });
  // describe('updateOrderStatus', () => {
  //   it('I hope to update this order', async () => {
  //     order[0].status = updateOrder.status;

  //     const result = orderService.updateOrderStatus(updateOrder);
  //     expect(orderModel.prototype.save).toBeCalledWith();
  //     if (
  //       updateOrder.status === 'completed' ||
  //       updateOrder.status === 'canceled'
  //     ) {
  //       expect(orderModel.deleteOne).toBeCalledWith();
  //     }
  //     expect(order[0].status).toEqual(updateOrder.status);
  //     expect(result).toEqual(order[0]);
  //   });
  // });
});
