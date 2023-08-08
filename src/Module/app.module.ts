import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuModule } from './menu.module';
import { OrderModule } from './order.module';
import { CategoryModule } from './category.module';
import { UserModule } from './user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import configuration from '../Config/configuration';
import { TableModule } from './table.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'prod',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.prod'],
      load: [configuration],
    }),
    MulterModule.register({ dest: './uploads' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Importa o ConfigModule
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb'), // Usa o ConfigService para acessar a variável de ambiente
      }),
      inject: [ConfigService], // Injeta o ConfigService
    }),
    MenuModule,
    OrderModule,
    CategoryModule,
    UserModule,
    TableModule,
  ],
})
export class AppModule {}
