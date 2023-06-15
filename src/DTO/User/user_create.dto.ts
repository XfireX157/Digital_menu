import { IsString, IsNotEmpty } from 'class-validator';
import { Role } from 'src/Schema/Role.enum';

export class UserCreateDTO {
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  role: Role;
}
