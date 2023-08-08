import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class OrderPagineDTO {
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
