import { PasswordResetDTO } from 'src/DTO/User/resetPassword.dto';
import { UserCreateDTO } from 'src/DTO/User/user_create.dto';
import { UserLoginDto } from 'src/DTO/User/user_login.dto';
import { User } from 'src/Schema/user.schema';

export interface IUserService {
  register(user: UserCreateDTO);
  login(users: UserLoginDto);
  forgotPassword(email: string);
  resetPassword(passwordToken: PasswordResetDTO);
  getUserFromToken(authorization: string): Promise<User>;
  findEmail(email: string): Promise<User>;
  GenerateHash(): Promise<string>;
}
