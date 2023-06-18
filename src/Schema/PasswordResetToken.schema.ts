import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordResetDocument = HydratedDocument<PasswordReset>;

@Schema()
export class PasswordReset {
  @Prop()
  token: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  tokenExpire: Date;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
