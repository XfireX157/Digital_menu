import { ApiProperty, PickType } from '@nestjs/swagger';
import { ForgotPasswordDTO } from './forgot_Password.dto';
import { IsString } from 'class-validator';

export class ResetPasswordDTO extends PickType(ForgotPasswordDTO, [
  'token',
] as const) {
  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  confirmPassword: string;
}
