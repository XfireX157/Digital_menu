import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class MenuCreateDTO {
  @ApiProperty({ type: Types.ObjectId })
  _id: Types.ObjectId;

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
    type: 'string',
    format: 'binary',
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

export class MenuViewDTO extends PartialType(MenuCreateDTO) {}

export class MenuUpdateDTO extends PartialType(MenuCreateDTO) {}
