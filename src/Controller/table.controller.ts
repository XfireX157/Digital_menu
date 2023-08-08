import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Table } from '../Schema/table.shema';
import { TableService } from '../Service/table.service';

@ApiTags('Tables')
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get()
  findAll(): Promise<Table[]> {
    return this.tableService.findAll();
  }

  @Post()
  createTable(@Body('tableNumber') tableNumber: number): Promise<Table> {
    return this.tableService.createTable(tableNumber);
  }

  @Delete(':id')
  deleteTable(@Param('id') id: string): Promise<Table> {
    return this.tableService.deleteTable(id);
  }
}
