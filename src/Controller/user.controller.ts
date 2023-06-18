import { Controller, Post, Body } from '@nestjs/common';
import { ResetPasswordDTO } from 'src/DTO/User/reset_Password.dto';
import { UserCreateDTO } from 'src/DTO/User/user_create.dto';
import { UserLoginDto } from 'src/DTO/User/user_login.dto';
import { UserService } from 'src/Service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async Register(@Body() user: UserCreateDTO) {
    return this.userService.register(user);
  }

  @Post('login')
  async Login(@Body() user: UserLoginDto) {
    return this.userService.login(user);
  }

  @Post('forgot-password')
  async ForgotPassword(@Body('email') email: string) {
    return this.userService.forgetPassword(email);
  }

  @Post('reset-password')
  async ResertPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return this.userService.resetPassword(resetPasswordDTO);
  }
}
