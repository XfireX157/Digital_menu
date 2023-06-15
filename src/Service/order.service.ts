import { Model } from 'mongoose';
import { Order } from 'src/Schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Menu } from 'src/Schema/menu.schema';
import { ForbiddenException } from 'src/Exception/forbidden.exception';
import { MenuService } from './menu.service';
import { OrderPagineDTO } from 'src/DTO/Order/OrderPagine.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly menuService: MenuService,
  ) {}

  async findAll(order: OrderPagineDTO): Promise<Order[]> {
    const { page = 0, pageSize = 20 } = order;
    const findAll = await this.orderModel
      .find()
      .skip(page)
      .limit(pageSize)
      .exec();
    if (findAll.length === 0) {
      throw new ForbiddenException('Não existe nenhuma categoria criada', 204);
    }
    return findAll;
  }

  async findId(id: string): Promise<Order> {
    const findId = await this.orderModel.findById({ id: id }).exec();
    if (!findId) {
      throw new ForbiddenException('Esse Id não existe na aplicação', 404);
    }

    return findId;
  }

  async createOrder(tableNumber: number, menuItemId: string[]) {
    const menuItem = await this.findMenu(menuItemId);
    const totalPrice = this.calculateTotal(menuItem);
    const orderNumber = this.generateOrderNumber();
    const newOrder = new this.orderModel({
      tableNumber,
      orderNumber,
      totalPrice,
      menuItem,
    });
    return newOrder.save();
  }

  private async findMenu(menuItemId: string[]): Promise<Menu[]> {
    const menuArray = [];
    for (let i = 0; i < menuItemId.length; i++) {
      const element = menuItemId[i];
      const orderMenu = await this.menuService.findId(element);
      menuArray.push(orderMenu);
    }

    return menuArray;
  }

  private calculateTotal(items: Menu[]): number {
    let total = 0;
    items.forEach((element) => {
      total += element.price;
    });
    return total;
  }

  private generateOrderNumber(): string {
    let numRandom = Math.floor(Math.random() * 9999).toString();
    return (numRandom += 1);
  }
}
