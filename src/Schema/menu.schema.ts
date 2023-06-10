import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from './Role.enum';

export type MenuDocument = HydratedDocument<Menu>;

@Schema()
export class Menu extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop()
  role: Role[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
