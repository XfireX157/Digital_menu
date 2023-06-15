import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { OrderPagineDTO } from 'src/DTO/Order/OrderPagine.dto';
import { Order } from 'src/Schema/order.schema';
import { OrderService } from 'src/Service/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Query() order: OrderPagineDTO): Promise<Order[]> {
    return this.orderService.findAll(order);
  }

  @Get(':id')
  findId(@Param('id') id: string): Promise<Order> {
    return this.orderService.findId(id);
  }

  @Post()
  create(
    @Body('tableNumber') tableNumber: number,
    @Body('menuItemId') menuItemId: string[],
  ) {
    return this.orderService.createOrder(tableNumber, menuItemId);
  }
}
