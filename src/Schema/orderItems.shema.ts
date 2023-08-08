import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Menu } from './menu.schema';

export type OrderItemsDocument = HydratedDocument<OrderItems>;

@Schema()
export class OrderItems {
  @Prop({ type: Number })
  amount: number;

  @Prop({ type: Number })
  price_sale: number;

  @Prop({ ref: 'Menu' })
  menu: Menu;
}

export const OrderItemsSchema = SchemaFactory.createForClass(OrderItems);
