import { PickType } from '@nestjs/swagger';
import { OrderCreateDTO } from './OrderCreate.dto';

export class OrderUpdateStatus extends PickType(OrderCreateDTO, [
  'orderNumber',
  'status',
] as const) {}
