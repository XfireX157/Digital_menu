import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiProperty()
  @IsString()
  token: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsDate()
  @ApiProperty()
  tokenExpire: Date;
}
