import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Role } from 'src/Schema/Role.enum';

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

  @ApiProperty({ enum: ['admin', 'user'] })
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  role: Role;
}
