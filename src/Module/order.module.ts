import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from 'src/Controller/order.controller';
import { Menu, MenuSchema } from 'src/Schema/menu.schema';
import { Order, OrderSchema } from 'src/Schema/order.schema';
import { OrderItems, OrderItemsSchema } from 'src/Schema/orderItems.shema';
import { OrderService } from 'src/Service/order.service';
import { Table, TableSchema } from 'src/Schema/table.shema';
import { TableService } from 'src/Service/table.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItems.name, schema: OrderItemsSchema },
      { name: Menu.name, schema: MenuSchema },
      { name: Table.name, schema: TableSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, TableService],
})
export class OrderModule {}
