import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderStatus } from '../Enum/OrderStatus.enum';
import { OrderItems } from './orderItems.shema';
import { Table } from './table.shema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ default: 0 })
  totalPrice: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ ref: 'OrderItems' })
  OrderItems: OrderItems[];

  @Prop({ ref: 'Table' })
  table: Table;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
