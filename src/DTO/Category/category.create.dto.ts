import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryCreateDTO {
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  name: string;
}
