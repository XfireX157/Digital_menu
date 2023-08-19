import {
  OrderCreateDTO,
  OrderUpdateStatus,
} from 'src/DTO/Order/order_create.dto';
import { OrderPagineDTO } from 'src/DTO/Order/order_pagine.dto';
import { Order } from 'src/Schema/order.schema';

export interface IOrderService {
  findAll(menu: OrderPagineDTO): Promise<Order[]>;
  findByOrder(id: string): Promise<Order>;
  createOrder(
    customerName: string,
    tableNumber: number,
    orders: OrderCreateDTO,
  );
  updateOrderStatus(updateOrder: OrderUpdateStatus): Promise<Order>;
}
