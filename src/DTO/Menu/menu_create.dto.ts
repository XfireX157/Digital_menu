import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class MenuCreateDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  description: string;

  @ApiProperty({
    type: String,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  price: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  image: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Esse campo não pode está vazio' })
  categoryName: string;
}
