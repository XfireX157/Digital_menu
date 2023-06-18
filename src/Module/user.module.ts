import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/Controller/user.controller';
import {
  PasswordReset,
  PasswordResetSchema,
} from 'src/Schema/PasswordResetToken.schema';
import { User, UserSchema } from 'src/Schema/user.schema';
import { EmailService } from 'src/Service/email.service';
import { UserService } from 'src/Service/user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secreta',
      signOptions: { expiresIn: 84600 },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PasswordReset.name, schema: PasswordResetSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
