import { Controller, Post, Body } from '@nestjs/common';
import { UserCreateDTO } from 'src/DTO/User/user_create.dto';
import { userLoginDto } from 'src/DTO/User/user_login.dto';
import { UserService } from 'src/Service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async Register(@Body() user: UserCreateDTO) {
    return this.userService.register(user);
  }

  @Post('login')
  async Login(@Body() user: userLoginDto) {
    return this.userService.login(user);
  }
}
