import { Module } from '@nestjs/common';
import { MenuController } from 'src/Controller/menu.controller';
import { MenuService } from 'src/Service/menu.service';

@Module({
  imports: [],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
