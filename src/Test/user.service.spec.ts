import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../Service/user.service';
import { PasswordReset } from '../Schema/PasswordResetToken.schema';
import { User } from '../Schema/user.schema';
import { EmailService } from '../Service/email.service';
import { TestingModule, Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserCreateDTO } from 'src/DTO/User/user_create.dto';
import { Role } from '../Enum/Role.enum';
import { UserLoginDto } from 'src/DTO/User/user_login.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;
  let resetPasswordModel: Model<PasswordReset>;
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
            deleteOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockedToken'),
            verify: jest.fn().mockResolvedValue({
              email: 'test@example.com',
              roles: ['user'],
            }),
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
    resetPasswordModel = module.get<Model<PasswordReset>>(
      getModelToken(PasswordReset.name),
    );
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
    expect(userModel).toBeDefined();
    expect(resetPasswordModel).toBeDefined();
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
      const token = 'test-token';
      const email = 'test@example.com';
      const ForgetPassword = {
        token,
        email,
        tokenExpire: new Date(Date.now() + 300000),
      };

      jest
        .spyOn(userService, 'GenerateHash')
        .mockImplementation(() => Promise.resolve(token));

      // Replace the property instead of spying on it
      jest.replaceProperty(
        resetPasswordModel,
        'findOne',
        jest.fn().mockResolvedValue(ForgetPassword),
      );

      jest.spyOn(userModel, 'findOne').mockResolvedValue({
        email,
        password: await bcrypt.hash('old-password', 10), // Mocking the old hashed password
        save: jest.fn().mockResolvedValue(undefined),
      } as any);

      const resetPasswordDto = {
        token,
        password: 'new-password',
        confirmPassword: 'new-password',
      };

      const result = await userService.resetPassword(resetPasswordDto);

      expect(result).toEqual({ message: 'Senha redefinida com sucesso' });
      expect(resetPasswordModel.deleteOne).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(userModel.findOne().exec).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(emailService.sendMail).toHaveBeenCalledWith(
        email,
        'Redefinição da sua senha',
        `Verifique sua conta, com essa token: ${token}`,
      );
    });

    // Add more test cases to cover different scenarios if needed
  });

  describe('forgetPassword', () => {
    it('should reset the password and return success message', async () => {
      const token = 'test-token';
      const email = 'test@example.com';
      const ForgetPassword = {
        token,
        email,
        tokenExpire: new Date(Date.now() + 300000),
      };

      jest
        .spyOn(userService, 'GenerateHash')
        .mockImplementation(() => Promise.resolve(token));

      jest
        .spyOn(resetPasswordModel, 'findOne')
        .mockResolvedValue(ForgetPassword);

      jest.spyOn(userModel, 'findOne').mockResolvedValue({
        email,
        password: await bcrypt.hash('old-password', 10), // Mocking the old hashed password
        save: jest.fn().mockResolvedValue(undefined),
      } as any);

      const resetPasswordDto = {
        token,
        password: 'new-password',
        confirmPassword: 'new-password',
      };

      const result = await userService.resetPassword(resetPasswordDto);

      expect(result).toEqual({ message: 'Senha redefinida com sucesso' });
      expect(resetPasswordModel.deleteOne).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(userModel.findOne().exec).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(emailService.sendMail).toHaveBeenCalledWith(
        email,
        'Redefinição da sua senha',
        `Verifique sua conta, com essa token: ${token}`,
      );
    });

    // Add more test cases to cover different scenarios if needed
  });
});
