import { Controller, Post, Body, Get, Query, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderPagineDTO } from 'src/DTO/Order/orderPagine.dto';
import { OrderUpdateStatus } from 'src/DTO/Order/orderUpdateStatus.dto';
import { Order } from 'src/Schema/order.schema';
import { OrderService } from 'src/Service/order.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Query() order: OrderPagineDTO): Promise<Order[]> {
    return this.orderService.findAll(order);
  }

  @Get('commands')
  findOrderNumber(@Query('orderNumber') orderNumber: string): Promise<Order> {
    return this.orderService.findByOrderNumber(orderNumber);
  }

  @Post()
  async create(
    @Body('tableNumber') tableNumber: number,
    @Body('menuItemId') menuItemId: string[],
  ) {
    return await this.orderService.createOrder(tableNumber, menuItemId);
  }

  @Patch()
  async updateStatus(
    @Body() orderUpdateStatus: OrderUpdateStatus,
  ): Promise<Order> {
    return await this.orderService.updateOrderStatus(orderUpdateStatus);
  }
}
