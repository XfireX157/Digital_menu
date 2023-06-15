import { IsOptional } from 'class-validator';

export class OrderPagineDTO {
  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}
