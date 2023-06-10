import { Module } from '@nestjs/common';
import { MenuModule } from './Menu.module';

@Module({
  imports: [MenuModule],
})
export class AppModule {}
