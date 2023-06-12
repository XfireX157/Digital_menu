import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Menu } from './menu.schema';

export type MenuDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ required: true })
  tableNumber: number;

  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ required: true })
  total: number;

  @Prop()
  totalPrice: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Menu' }], required: true })
  menuItems: Menu[];
}

export const OrderSchama = SchemaFactory.createForClass(Order);
