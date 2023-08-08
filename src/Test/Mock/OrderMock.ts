import { OrderUpdateStatus } from '../../DTO/Order/orderCreate.dto';
import { OrderStatus } from '../../Enum/OrderStatus.enum';
import { Order } from '../../Schema/order.schema';
import { Types } from 'mongoose';

export const order: Order[] = [
  {
    totalPrice: 220.0,
    status: OrderStatus.PENDING,
    OrderItems: [
      {
        amount: 4,
        price_sale: 320.0,
        menu: {
          _id: new Types.ObjectId(),
          name: 'Macarrão',
          description: 'Macarrão ao molho branco',
          price: 34.0,
          image: 'Imagem do macarrão',
          category: {
            name: 'almoço',
          },
        },
      },
    ],
    table: {
      _id: new Types.ObjectId(),
      available: true,
      tableNumber: 5,
      reservationTime: new Date(),
      reservedByName: undefined,
    },
  },
];

export const updateOrder: OrderUpdateStatus = {
  _id: new Types.ObjectId(),
  status: OrderStatus.COMPLETED,
};
