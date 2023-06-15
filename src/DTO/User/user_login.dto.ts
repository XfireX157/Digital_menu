import { PickType } from '@nestjs/mapped-types';
import { UserCreateDTO } from './user_create.dto';

export class userLoginDto extends PickType(UserCreateDTO, [
  'email',
  'password',
] as const) {}
