import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class createDTO {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;
}
