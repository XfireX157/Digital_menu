import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/Enum/Role.enum';

export class UserCreateDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  password: string;

  @ApiProperty({ type: String, enum: Role })
  @IsEnum(Role)
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  role: Role;
}
