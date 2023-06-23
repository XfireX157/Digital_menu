import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuModule } from './Menu.module';
import { OrderModule } from './order.module';
import { CategoryModule } from './category.module';
import { UserModule } from './user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../Config/configuration';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
      load: [configuration],
    }),
    MulterModule.register({ dest: './uploads' }),
    MongooseModule.forRoot('mongodb://localhost:27017/mongo'),
    MenuModule,
    OrderModule,
    CategoryModule,
    UserModule,
  ],
})
export class AppModule {}
