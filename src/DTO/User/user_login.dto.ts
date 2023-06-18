import { PickType } from '@nestjs/swagger';
import { UserCreateDTO } from './user_create.dto';

export class UserLoginDto extends PickType(UserCreateDTO, [
  'email',
  'password',
] as const) {}
