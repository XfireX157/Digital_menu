import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class MenuCreateDTO {
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  image: string;

  @IsString()
  @IsNotEmpty({ message: 'Esse campo não pode está vazio' })
  categoryName: string;
}
