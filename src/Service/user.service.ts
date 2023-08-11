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
import { PasswordResetDTO } from '../DTO/User/resetPassword.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(PasswordReset.name)
    private PasswordReset: Model<PasswordReset>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(user: UserCreateDTO) {
    const findEmail = await this.UserModel.findOne({ email: user.email });
    if (findEmail) {
      throw new ForbiddenException('Esse usuario já existe', 400);
    }
    user.password = await bcrypt.hash(user.password, 10);
    return this.UserModel.create(user);
  }

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

  async find(): Promise<PasswordReset[]> {
    const findAll = await this.PasswordReset.find();
    return findAll;
  }

  async forgotPassword(email: string) {
    await this.findEmail(email);
    const token = await this.GenerateHash();

    const PasswordResetArray: ForgotPasswordDTO = {
      token,
      email,
      tokenExpire: new Date(Date.now() + 3000000),
    };

    await this.PasswordReset.create(PasswordResetArray);

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

  async resetPassword(passwordToken: PasswordResetDTO) {
    const passwordReset = await this.PasswordReset.findOne({
      token: passwordToken.token,
    });

    if (!passwordReset) {
      throw new ForbiddenException('Esse token não existe', 404);
    }

    const user = await this.UserModel.findOne({ email: passwordReset.email });

    if (!user) {
      throw new ForbiddenException('Esse usuario não existe', 404);
    }

    if (passwordReset.tokenExpire < new Date()) {
      await this.PasswordReset.deleteOne({
        token: passwordReset.token,
      });
      throw new ForbiddenException('Esse token expirou', 400);
    }

    if (passwordToken.password !== passwordToken.confirmPassword) {
      throw new ForbiddenException('A senha está errada', 400);
    }

    user.password = await bcrypt.hash(passwordToken.password, 10);
    await user.save();

    await this.PasswordReset.deleteOne({
      token: passwordReset.token,
    });
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
  }
}
