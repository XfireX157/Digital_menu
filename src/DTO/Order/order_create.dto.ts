import { IsNumber, IsNotEmpty } from 'class-validator';

export class OrderCreateDTO {
  tableNumber: number;

  totalPrice: number;

  total: number;

  menuId: string;
}
