import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { OrderStatus } from 'src/Enum/OrderStatus.enum';
import { Menu } from 'src/Schema/menu.schema';

export class OrderCreateDTO {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  tableNumber: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  orderNumber: string;

  @ApiProperty({ type: String })
  totalPrice: number;

  @ApiProperty({ type: [Menu] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  menuItem: string[];

  @ApiProperty({ type: String, enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
