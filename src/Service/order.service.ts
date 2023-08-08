import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../Schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu, MenuDocument } from '../Schema/menu.schema';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { OrderPagineDTO } from '../DTO/Order/orderPagine.dto';
import { OrderStatus } from '../Enum/OrderStatus.enum';
import {
  OrderCreateDTO,
  OrderUpdateStatus,
} from 'src/DTO/Order/orderCreate.dto';
import { OrderItems } from '../Schema/orderItems.shema';
import { TableService } from './table.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Menu.name) private menuModel: Model<MenuDocument>,
    private tableModel: TableService,
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
    const table = await this.tableModel.reserveTable(customerName, tableNumber);
    const menuItem = orders.OrderItems.map((item) => item.menuId);
    const findMenu = await this.findMenu(menuItem);
    const totalPrice = findMenu.reduce((total, item) => total + item.price, 0);

    const newOrder = new this.orderModel();
    newOrder.table = table;
    newOrder.totalPrice = totalPrice;
    newOrder.status = OrderStatus.PENDING;

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

    newOrder.OrderItems = ordersItems;
    return newOrder.save();
  }

  async updateOrderStatus(updateOrder: OrderUpdateStatus): Promise<Order> {
    const order = await this.orderModel.findById(updateOrder._id).exec();
    const tableId = order?.table?._id.toString();
    if (tableId === undefined) {
      throw new NotFoundException(
        `O id do pedido informado não existe ${updateOrder._id}`,
      );
    }

    if (order === null) {
      throw new NotFoundException(
        `O id do pedido informado não existe ${updateOrder._id}`,
      );
    }

    order.status = updateOrder.status;

    if (
      updateOrder.status === 'completed' ||
      updateOrder.status === 'canceled'
    ) {
      await this.tableModel.cancelReservation(tableId);
      await order.deleteOne();
    }

    return order;
  }

  //metodos separados do controllers

  private async findMenu(menuId: string[]): Promise<Menu[]> {
    const menuArray: Menu[] = [];
    for (let i = 0; i < menuId.length; i++) {
      const element = menuId[i];
      const orderMenu = await this.menuModel
        .findOne({
          _id: new Types.ObjectId(element),
        })
        .exec();
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
