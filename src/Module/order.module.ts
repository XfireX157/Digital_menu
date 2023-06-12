import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from 'src/Controller/order.controller';
import { Category, CategorySchema } from 'src/Schema/category.schema';
import { Menu, MenuSchema } from 'src/Schema/menu.schema';
import { Order, OrderSchama } from 'src/Schema/order.schema';
import { CategoryService } from 'src/Service/category.service';
import { MenuService } from 'src/Service/menu.service';
import { OrderService } from 'src/Service/order.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchama },
      { name: Menu.name, schema: MenuSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, MenuService, CategoryService],
})
export class OrderModule {}
