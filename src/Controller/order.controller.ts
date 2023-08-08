import { Controller, Post, Body, Get, Query, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderPagineDTO } from '../DTO/Order/order_pagine.dto';
import {
  OrderCreateDTO,
  OrderUpdateStatus,
} from '../DTO/Order/order_create.dto';
import { Order } from '../Schema/order.schema';
import { OrderService } from '../Service/order.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Query() order: OrderPagineDTO): Promise<Order[]> {
    return this.orderService.findAll(order);
  }

  @Get(':id')
  findOrderNumber(@Query('id') orderNumber: string): Promise<Order> {
    return this.orderService.findByOrder(orderNumber);
  }

  @Post()
  async create(
    @Body('customerName') customerName: string,
    @Body('tableNumber') tableNumber: number,
    @Body() orders: OrderCreateDTO,
  ) {
    return await this.orderService.createOrder(
      customerName,
      tableNumber,
      orders,
    );
  }

  @Patch()
  async updateStatus(
    @Body() orderUpdateStatus: OrderUpdateStatus,
  ): Promise<Order> {
    return await this.orderService.updateOrderStatus(orderUpdateStatus);
  }
}
