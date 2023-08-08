import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;

@Schema()
export class Table {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  tableNumber: number;

  @Prop({ type: Boolean, default: true })
  available: boolean;

  @Prop({ type: String })
  reservedByName: string | undefined;

  @Prop({ type: Date, default: Date.now })
  reservationTime: Date | undefined;
}

export const TableSchema = SchemaFactory.createForClass(Table);
