import { Role } from '../../Enum/Role.enum';
import { UserCreateDTO } from '../../DTO/User/user_create.dto';

export const register: UserCreateDTO = {
  username: 'Username',
  email: 'email',
  password: 'password',
  role: Role.ADMIN,
};
