import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Menu } from './menu.schema';
import { OrderStatus } from 'src/Enum/OrderStatus.enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ required: true })
  tableNumber: number;

  @Prop({ unique: true })
  orderNumber: string;

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Menu' }], required: true })
  menuItem: Menu[];

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
