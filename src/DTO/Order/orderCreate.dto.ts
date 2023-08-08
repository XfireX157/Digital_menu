import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { OrderStatus } from 'src/Enum/OrderStatus.enum';

export class OrderDTO {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  menuId: string;
}

export class OrderCreateDTO {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @Type(() => OrderDTO)
  OrderItems: OrderDTO[];
}

export class OrderUpdateStatus {
  @ApiProperty({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @ApiProperty({ type: String, enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
