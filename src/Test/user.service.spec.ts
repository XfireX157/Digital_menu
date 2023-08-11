import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../Service/user.service';
import { PasswordReset } from '../Schema/PasswordResetToken.schema';
import { User } from '../Schema/user.schema';
import { EmailService } from '../Service/email.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserCreateDTO } from '../DTO/User/user_create.dto';
import { Role } from '../Enum/Role.enum';
import { UserLoginDto } from '../DTO/User/user_login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ForgotPasswordDTO } from '../DTO/User/forgot_Password.dto';
import { ForbiddenException } from '../Exception/forbidden.exception';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;
  let passwordResetModel: Model<PasswordReset>;
  let jwtService: JwtService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(PasswordReset.name),
          useValue: {
            create: jest.fn(), // Mock the create method
            findOne: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockedToken'),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    passwordResetModel = module.get<Model<PasswordReset>>(
      getModelToken(PasswordReset.name),
    );
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
    expect(userModel).toBeDefined();
    expect(passwordResetModel).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(emailService).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const userCreateDto: UserCreateDTO = {
        username: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: Role.ADMIN,
      };

      (userModel.create as jest.Mock).mockResolvedValueOnce(userCreateDto);

      const result = await userService.register(userCreateDto);

      expect(result).toEqual(userCreateDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    });

    it('it should return me an error saying that user already exists', async () => {
      const userCreateDto: UserCreateDTO = {
        username: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: Role.ADMIN,
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(userCreateDto);

      await expect(userService.register(userCreateDto)).rejects.toThrow(
        new ForbiddenException('Esse usuario já existe', 400),
      );
    });
  });

  describe('login', () => {
    it('must log in with the existing user account', async () => {
      // Arrange
      const userLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user: User = {
        username: 'gustavo',
        email: userLoginDto.email,
        password: await bcrypt.hash(userLoginDto.password, 10),
        role: Role.ADMIN,
      };

      // Mock the behavior of UserModel.findOne to return the user
      (userModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      // Act
      const result = await userService.login(userLoginDto);

      // Assert
      expect(result).toHaveProperty('token');
    });

    it('should throw UnauthorizedException when login fails', async () => {
      const users = {
        email: 'john@example.com',
        password: 'wrongPassword',
      };

      const user = {
        _id: 'someId',
        email: users.email,
        password: await bcrypt.hash('correctPassword', 10),
        role: 'user',
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      expect(userService.login(users)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgetPassword', () => {
    it('should reset the password and return success message', async () => {
      const email = 'test@example.com';
      const token = 'test-token';

      const PasswordResetArray: ForgotPasswordDTO = {
        token,
        email,
        tokenExpire: new Date(Date.now() + 300000),
      };

      const findOneUserMock = jest.fn().mockResolvedValue(PasswordResetArray);

      userModel.findOne = findOneUserMock;

      const sendMailSpy = jest.spyOn(emailService, 'sendMail');

      jest.spyOn(userService, 'GenerateHash').mockResolvedValue(token);

      const result = await userService.forgotPassword(email);

      expect(findOneUserMock).toHaveBeenCalledWith({ email });
      expect(sendMailSpy).toHaveBeenCalledWith(
        email,
        'Redefinição da sua senha',
        `Verifique sua conta, com essa token: ${token}`,
      );
      expect(result).toEqual({
        message:
          'Um e-mail de redefinição de senha foi enviado para o seu endereço de e-mail',
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset the password and return success message', async () => {
      const passwordToken = {
        token: 'validToken',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      const validToken = {
        token: passwordToken.token,
        email: 'user@example.com',
        tokenExpire: new Date(Date.now() + 300000),
      };

      const user = {
        email: validToken.email,
        password: 'oldPassword',
        save: jest.fn(),
      };

      const deleteResult = {
        deletedCount: 1,
      };

      (passwordResetModel.findOne as jest.Mock).mockResolvedValue(validToken);

      (userModel.findOne as jest.Mock).mockResolvedValue(user);

      jest
        .spyOn(passwordResetModel, 'deleteOne')
        .mockResolvedValue(deleteResult.deletedCount as any);

      const result = await userService.resetPassword(passwordToken);

      expect(result).toEqual({ message: 'Senha redefinida com sucesso' });
      expect(user.save).toHaveBeenCalled();
      expect(passwordResetModel.deleteOne).toHaveBeenCalledWith({
        token: validToken.token,
      });
    });

    it('should throw ForbiddenException if passwords do not match', async () => {
      const passwordToken = {
        token: 'validToken',
        password: 'newPassword',
        confirmPassword: 'differentPassword',
      };

      const validToken = {
        token: passwordToken.token,
        email: 'user@example.com',
        tokenExpire: new Date(Date.now() + 300000),
      };

      (passwordResetModel.findOne as jest.Mock).mockResolvedValue(validToken);

      (userModel.findOne as jest.Mock).mockResolvedValue({
        email: validToken.email,
      });

      await expect(userService.resetPassword(passwordToken)).rejects.toThrow(
        new ForbiddenException('A senha está errada', 400),
      );
    });

    it('should throw ForbiddenException if token does not exist', async () => {
      const passwordToken = {
        token: 'nonExistentToken',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      (passwordResetModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(userService.resetPassword(passwordToken)).rejects.toThrow(
        new ForbiddenException('Esse token não existe', 404),
      );
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      const passwordToken = {
        token: 'validToken',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      (passwordResetModel.findOne as jest.Mock).mockResolvedValue({
        token: passwordToken.token,
        email: 'user@example.com',
        tokenExpire: new Date(Date.now() + 300000),
      });

      (userModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(userService.resetPassword(passwordToken)).rejects.toThrow(
        new ForbiddenException('Esse usuario não existe', 404),
      );
    });

    it('should throw ForbiddenException if token has expired', async () => {
      const passwordToken = {
        token: 'validToken',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      const expiredToken = {
        token: passwordToken.token,
        email: 'user@example.com',
        tokenExpire: new Date(Date.now() - 300000),
      };

      (passwordResetModel.findOne as jest.Mock).mockResolvedValue(expiredToken);

      (userModel.findOne as jest.Mock).mockResolvedValue({
        email: expiredToken.email,
      });

      await expect(userService.resetPassword(passwordToken)).rejects.toThrow(
        new ForbiddenException('Esse token expirou', 400),
      );
    });
  });
});
