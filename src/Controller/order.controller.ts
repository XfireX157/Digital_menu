import { Controller, Post, Body } from '@nestjs/common';
import { OrderCreateDTO } from 'src/DTO/Order/order_create.dto';
import { OrderService } from 'src/Service/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() order: OrderCreateDTO) {
    return this.orderService.createOrder(order);
  }
}
