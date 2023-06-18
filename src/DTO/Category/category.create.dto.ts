import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryCreateDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'Essa campo não pode está vazio' })
  name: string;
}
