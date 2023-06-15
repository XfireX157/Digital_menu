import { IsOptional } from 'class-validator';

export class MenuPagineDTO {
  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}
