import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDTO } from '../DTO/User/user_create.dto';
import { User } from '../Schema/user.schema';
import { UserLoginDto } from '../DTO/User/user_login.dto';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { randomBytes } from 'crypto';
import { PasswordReset } from '../Schema/PasswordResetToken.schema';
import { ForgotPasswordDTO } from '../DTO/User/forgot_Password.dto';
import { ResetPasswordDTO } from '../DTO/User/reset_Password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(PasswordReset.name)
    private ResetPassword: Model<PasswordReset>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(user: UserCreateDTO) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.UserModel.create(user);
  }

<<<<<<< HEAD
  async login(user: userLoginDto) {
    return 'main';
=======
  async login(users: UserLoginDto) {
    const user = await this.findEmail(users.email);
    const isPasswordValid = await bcrypt.compare(users.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = {
      email: user.email,
      roles: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async forgetPassword(email: string) {
    await this.findEmail(email);
    const token = await this.GenerateHash();

    const PasswordResetArray: ForgotPasswordDTO = {
      token,
      email,
      tokenExpire: new Date(Date.now() + 300000),
    };

    const deleteToken = await this.ResetPassword.deleteOne({
      token: PasswordResetArray.token,
    });

    if (PasswordResetArray.tokenExpire < new Date()) {
      deleteToken.deletedCount;
    }

    await this.ResetPassword.create(PasswordResetArray);

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

    if (token === null) {
      throw new ForbiddenException('Esse token não existe', 404);
    }

    const user = await this.UserModel.findOne({ email: token.email }).exec();

    if (user === null) {
      throw new ForbiddenException('Esse usuario não existe', 404);
    }

    const deleteToken = await this.ResetPassword.deleteOne({
      token: passwordToken.token,
    });

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

  async getUserFromToken(authorization: string): Promise<User> {
    try {
      const token = authorization?.split(' ')[1];
      const decodedToken: User = await this.jwtService.verify(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async findEmail(email: string): Promise<User> {
    const getEmail = await this.UserModel.findOne({ email });
    if (!getEmail) throw new ForbiddenException('Esse usuario não existe', 404);
    return getEmail;
  }

  async GenerateHash(): Promise<string> {
    return randomBytes(20).toString('hex');
>>>>>>> develop
  }
}
