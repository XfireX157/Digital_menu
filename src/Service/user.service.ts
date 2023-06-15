import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDTO } from 'src/DTO/User/user_create.dto';
import { User } from 'src/Schema/user.schema';
import * as bcrypt from 'bcrypt';
import { userLoginDto } from 'src/DTO/User/user_login.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async register(user: UserCreateDTO) {
    user.password = await bcrypt.hash(user.password, 10);
    return new this.UserModel(user);
  }

  async login(user: userLoginDto) {
    return 'main';
  }
}
