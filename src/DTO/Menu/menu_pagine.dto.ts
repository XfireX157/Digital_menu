import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class MenuPagineDTO {
  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    type: Number,
  })
  @IsOptional()
  pageSize: number;
}
