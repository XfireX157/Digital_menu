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
import { OrderUpdateStatus } from '../DTO/Order/order_create.dto';
import { OrderStatus } from '../Enum/OrderStatus.enum';
import { NotFoundException } from '@nestjs/common';

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
            new: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken(Menu.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(Table.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              _id: 'tableId',
              available: false,
              save: jest.fn().mockResolvedValue(undefined),
            }),
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

  // describe('createOrder', () => {
  //   it('should create a new order', async () => {
  //     // Mock input data
  //     const customerName = 'John Doe';
  //     const tableNumber = 1;

  //     // Mock the table reservation
  //     const table: Table = {
  //       _id: new Types.ObjectId(),
  //       tableNumber: 1,
  //       available: false,
  //       reservationTime: undefined,
  //       reservedByName: undefined,
  //     };
  //     jest.spyOn(tableService, 'reserveTable').mockResolvedValue(table);

  //     // Mock the findMenu function
  //     const menuItems: Menu[] = [
  //       {
  //         _id: new Types.ObjectId('64d6619e4ccb3556015282cc'), // Ensure valid ObjectId string
  //         name: 'TestName',
  //         category: {
  //           name: 'testCategory', // Corrected typo here
  //         },
  //         description: 'testDescription',
  //         image: 'nome da imagem',
  //         price: 15,
  //       },
  //     ];
  //     jest.spyOn(menuService, 'findAll').mockResolvedValue(menuItems);

  //     const findMenu: Menu[] = [
  //       {
  //         _id: new Types.ObjectId('64d6619e4ccb3556015282cc'), // Ensure valid ObjectId string
  //         name: 'TestName',
  //         category: {
  //           name: 'testCategory',
  //         },
  //         description: 'testDescription',
  //         image: 'nome da imagem',
  //         price: 15,
  //       },
  //     ];
  //     // jest.spyOn(orderService, 'findMenu').mockResolvedValue(findMenu);

  //     const orderItems: OrderCreateDTO = {
  //       OrderItems: [{ menuId: '64d6619e4ccb3556015282cc', amount: 2 }],
  //     };

  //     // Execute the method
  //     const result = await orderService.createOrder(
  //       customerName,
  //       tableNumber,
  //       orderItems,
  //     );

  //     // Assertions
  //     expect(tableService.reserveTable).toHaveBeenCalledWith(
  //       customerName,
  //       tableNumber,
  //     );
  //     expect(menuService.findAll).toHaveBeenCalledWith([
  //       '64d6619e4ccb3556015282cc',
  //     ]);

  //     expect(result).toEqual;
  //   });
  // });

  describe('updateOrderStatus', () => {
    it('should update the order status and cancel reservation for completed/canceled status', async () => {
      const updateOrder: OrderUpdateStatus = {
        _id: new Types.ObjectId(),
        status: OrderStatus.COMPLETED,
      };

      const order = {
        _id: updateOrder._id,
        table: {
          _id: new Types.ObjectId(), // Mock table _id
        },
        save: jest.fn(),
        deleteOne: jest.fn(),
      } as any;

      (orderModel.findById as jest.Mock).mockResolvedValue(order);

      const result = await orderService.updateOrderStatus(updateOrder);

      expect(order.status).toEqual(updateOrder.status);
      expect(order.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(order);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      const updateOrder: OrderUpdateStatus = {
        _id: new Types.ObjectId(),
        status: OrderStatus.COMPLETED,
      };

      (orderModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        orderService.updateOrderStatus(updateOrder),
      ).rejects.toThrowError(
        new NotFoundException(
          `O id do mesa informado não existe ${updateOrder._id}`,
        ),
      );
    });

    it('should throw NotFoundException if tableId is undefined', async () => {
      const updateOrder: OrderUpdateStatus = {
        _id: new Types.ObjectId(),
        status: OrderStatus.COMPLETED,
      };

      const order = {
        _id: updateOrder._id,
        table: undefined,
      } as any;

      (orderModel.findById as jest.Mock).mockResolvedValue(order);

      await expect(
        orderService.updateOrderStatus(updateOrder),
      ).rejects.toThrowError(
        new NotFoundException(
          `O id do mesa informado não existe ${updateOrder._id}`,
        ),
      );
    });
  });
});
