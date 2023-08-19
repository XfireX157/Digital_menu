import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../Schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu, MenuDocument } from '../Schema/menu.schema';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { OrderPagineDTO } from '../DTO/Order/order_pagine.dto';
import { OrderStatus } from '../Enum/OrderStatus.enum';
import {
  OrderCreateDTO,
  OrderUpdateStatus,
} from '../DTO/Order/order_create.dto';
import { OrderItems } from '../Schema/orderItems.shema';
import { TableService } from './table.service';
import { IOrderService } from 'src/Interface/IOrder.service';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Menu.name) private menuModel: Model<MenuDocument>,
    private tableService: TableService,
  ) {}

  async findAll(order: OrderPagineDTO): Promise<Order[]> {
    const { page = 0, pageSize = 5 } = order;
    const findAll: Order[] = await this.orderModel
      .find()
      .skip(page)
      .limit(pageSize)
      .exec();
    if (!findAll.length) {
      throw new ForbiddenException('Não existe nenhuma ordem de pedido', 204);
    }
    return findAll;
  }

  async findByOrder(id: string): Promise<Order> {
    const findOrder = await this.orderModel.findById(id).exec();
    if (!findOrder) {
      throw new ForbiddenException('Essa ordem de pedido não existe', 204);
    }
    return findOrder;
  }

  async createOrder(
    customerName: string,
    tableNumber: number,
    orders: OrderCreateDTO,
  ) {
    const table = await this.tableService.reserveTable(
      customerName,
      tableNumber,
    );
    const menuItem = orders.OrderItems.map((item) => item.menuId);
    const findMenu = await this.findMenu(menuItem);
    const totalPrice = findMenu.reduce((total, item) => total + item.price, 0);

    const ordersItems = orders.OrderItems.map((item) => {
      const relatedMenu = findMenu.find(
        (menu) => menu._id.toString() === item.menuId,
      );

      if (relatedMenu === undefined) {
        throw new NotFoundException(
          `O menu com o id ${item.menuId} não foi encontrado`,
        );
      }

      const orderItem = new OrderItems();

      orderItem.menu = relatedMenu;
      orderItem.price_sale = relatedMenu.price;
      orderItem.amount = item.amount;
      return orderItem;
    });

    const newOrder: Order = {
      totalPrice: totalPrice,
      table: table,
      status: OrderStatus.PENDING,
      OrderItems: ordersItems,
    };

    return this.orderModel.create(newOrder);
  }

  async updateOrderStatus(updateOrder: OrderUpdateStatus): Promise<Order> {
    const order = await this.orderModel.findById(updateOrder._id);
    const tableId = order?.table?._id.toString();

    if (tableId === undefined) {
      throw new NotFoundException(
        `O id do mesa informado não existe ${updateOrder._id}`,
      );
    }

    if (!order) {
      throw new NotFoundException(
        `O id do pedido informado não existe ${updateOrder._id}`,
      );
    }

    order.status = updateOrder.status;

    if (
      updateOrder.status === 'completed' ||
      updateOrder.status === 'canceled'
    ) {
      await this.tableService.cancelReservation(tableId);
      await order.deleteOne();
    }

    return order;
  }

  private async findMenu(menuId: string[]): Promise<Menu[]> {
    const menuArray: Menu[] = [];
    for (let i = 0; i < menuId.length; i++) {
      const element = menuId[i];
      const orderMenu = await this.menuModel.findOne({
        _id: new Types.ObjectId(element),
      });
      if (orderMenu === null) {
        throw new NotFoundException(
          `O menu com o ID ${element} não foi encontrado`,
        );
      }
      menuArray.push(orderMenu);
    }
    return menuArray;
  }
}
