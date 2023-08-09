import { Controller, Post, Body, Get, Header, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { ResetPasswordDTO } from 'src/DTO/User/reset_Password.dto';
import { UserCreateDTO } from 'src/DTO/User/user_create.dto';
import { UserLoginDto } from 'src/DTO/User/user_login.dto';
import { PasswordReset } from 'src/Schema/PasswordResetToken.schema';
import { User } from 'src/Schema/user.schema';
import { UserService } from 'src/Service/user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  async findAll(): Promise<PasswordReset[]> {
    return this.userService.find();
  }

  @Get('session')
  @ApiHeaders([{ name: 'Authorization' }])
  @Header('X-Custom-Header', 'custon value')
  async getUserFromToken(
    @Headers('Authorization') authorization: string,
  ): Promise<User> {
    return this.userService.getUserFromToken(authorization);
  }

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
