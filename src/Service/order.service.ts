import { Model } from 'mongoose';
import { Order } from 'src/Schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Menu } from 'src/Schema/menu.schema';
import { OrderCreateDTO } from 'src/DTO/Order/order_create.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Menu.name) private menuItemModel: Model<Menu>,
  ) {}

  async createOrder(order: OrderCreateDTO) {
    const menuItems = await this.menuItemModel
      .find({ id: order.menuId })
      .exec();
    console.log(menuItems);
    const total = this.calculateTotal(menuItems);
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
