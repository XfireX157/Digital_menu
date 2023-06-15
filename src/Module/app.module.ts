import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuModule } from './Menu.module';
import { OrderModule } from './order.module';
import { CategoryModule } from './category.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mongo'),
    UserModule,
    MenuModule,
    OrderModule,
    CategoryModule,
  ],
})
export class AppModule {}
