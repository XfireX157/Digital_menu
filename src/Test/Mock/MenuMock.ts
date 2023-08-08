import { Types } from 'mongoose';
import { MenuViewDTO } from '../../DTO/Menu/menu_create.dto';

export const menu: MenuViewDTO[] = [
  {
    _id: new Types.ObjectId(),
    name: 'Category 1',
    price: 22.0,
    image: 'url image',
    description: 'descrição menu',
    categoryName: 'Jantar',
  },
  {
    _id: new Types.ObjectId(),
    name: 'Category 1',
    price: 22.0,
    image: 'url image',
    description: 'descrição menu',
    categoryName: 'Jantar',
  },
];
