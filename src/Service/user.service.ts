import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDTO } from 'src/DTO/User/user_create.dto';
import { User } from 'src/Schema/user.schema';
import { UserLoginDto } from 'src/DTO/User/user_login.dto';
import { ForbiddenException } from 'src/Exception/forbidden.exception';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PasswordReset } from 'src/Schema/PasswordResetToken.schema';
import { ForgotPasswordDTO } from 'src/DTO/User/forgot_Password.dto';
import { ResetPasswordDTO } from 'src/DTO/User/reset_Password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(PasswordReset.name)
    private ResetPassword: Model<PasswordReset>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private async findOne(email: string): Promise<User> {
    const getEmail = await this.UserModel.findOne({ email }).exec();
    if (!getEmail) throw new ForbiddenException('Esse usuario não existe', 404);
    return getEmail;
  }

  private async GenerateHash(): Promise<string> {
    return randomBytes(20).toString('hex');
  }

  async register(user: UserCreateDTO) {
    user.password = await bcrypt.hash(user.password, 10);
    return new this.UserModel(user).save();
  }

  async login(users: UserLoginDto) {
    const user = await this.findOne(users.email);
    const isPasswordValid = await bcrypt.compare(users.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = {
      email: user.email,
      password: user.password,
      roles: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async forgetPassword(email: string) {
    await this.findOne(email);
    const token = await this.GenerateHash();

    const PasswordResetArray: ForgotPasswordDTO = {
      token,
      email,
      tokenExpire: new Date(Date.now() + 300000),
    };

    const deleteToken = await this.ResetPassword.deleteOne({
      token: PasswordResetArray.token,
    }).exec();

    if (PasswordResetArray.tokenExpire < new Date()) {
      deleteToken.deletedCount;
    }

    await new this.ResetPassword(PasswordResetArray).save();

    await this.emailService.sendMail(
      email,
      'Redefinição da sua senha',
      `Verifique sua conta, com essa token: ${token}`,
    );

    return {
      message:
        'Um e-mail de redefinição de senha foi enviado para o seu endereço de e-mail',
    };
  }

  async resetPassword(passwordToken: ResetPasswordDTO) {
    const token = await this.ResetPassword.findOne({
      token: passwordToken.token,
    }).exec();

    const user = await this.UserModel.findOne({ email: token.email }).exec();

    const deleteToken = await this.ResetPassword.deleteOne({
      token: passwordToken.token,
    }).exec();

    if (!token) {
      throw new ForbiddenException('Esse token não existe', 404);
    }

    if (token.tokenExpire < new Date()) {
      deleteToken.deletedCount;
      throw new ForbiddenException('Esse token expirou', 404);
    }

    if (passwordToken.password !== passwordToken.confirmPassword) {
      throw new ForbiddenException('A senha está errada', 404);
    }

    user.password = await bcrypt.hash(passwordToken.password, 10);
    deleteToken.deletedCount;
    user.save();
    return { message: 'Senha redefinida com sucesso' };
  }
}
