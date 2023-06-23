import { Model } from 'mongoose';
import { Order } from 'src/Schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Menu } from 'src/Schema/menu.schema';
import { ForbiddenException } from 'src/Exception/forbidden.exception';
import { MenuService } from './menu.service';
import { OrderPagineDTO } from 'src/DTO/Order/orderPagine.dto';
import { randomBytes } from 'crypto';
import { OrderUpdateStatus } from 'src/DTO/Order/orderUpdateStatus.dto';
import { OrderStatus } from 'src/Enum/OrderStatus.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly menuService: MenuService,
  ) {}

  async findAll(order: OrderPagineDTO): Promise<Order[]> {
    const { page = 0, pageSize = 5 } = order;
    const findAll: Order[] = await this.orderModel
      .find()
      .populate('menuItem')
      .skip(page)
      .limit(pageSize)
      .exec();
    if (findAll.length === 0) {
      throw new ForbiddenException('Não existe nenhuma categoria', 204);
    }
    return findAll;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const findOrder = await this.orderModel
      .findOne({ orderNumber: orderNumber })
      .populate('menuItem')
      .exec();
    if (!findOrder) {
      throw new ForbiddenException('Esse Id não existe na aplicação', 404);
    }
    return findOrder;
  }

  async createOrder(tableNumber: number, menuItemId: string[]) {
    const menuItem = await this.findMenu(menuItemId);
    console.log(menuItem);
    const totalPrice = this.calculateTotal(menuItem);
    const orderNumber = await this.GenerateHash();
    const newOrder = new this.orderModel({
      tableNumber,
      orderNumber,
      totalPrice,
      menuItem,
      status: OrderStatus.PENDING,
    });
    return newOrder.save();
  }

  private async findMenu(menuItemId: string[]): Promise<Menu[]> {
    const menuArray = [];
    console.log(menuArray);
    for (let i = 0; i < menuItemId.length; i++) {
      const element = menuItemId[i];
      const orderMenu = await this.menuService.findId(element);
      menuArray.push(orderMenu);
    }
    return menuArray;
  }

  async updateOrderStatus(updateOrder: OrderUpdateStatus): Promise<Order> {
    const order = await this.orderModel
      .findOne({
        orderNumber: updateOrder.orderNumber,
      })
      .exec();
    order.status = updateOrder.status;
    await order.save();

    if (updateOrder.status === 'completed') {
      await order.deleteOne(); // Exclua o pedido do banco de dados
    }

    return order;
  }

  private calculateTotal(items: Menu[]): number {
    let total = 0;
    items.forEach((element) => {
      total += element.price;
    });
    return total;
  }

  private async GenerateHash(): Promise<string> {
    return randomBytes(20).toString('hex');
  }
}
