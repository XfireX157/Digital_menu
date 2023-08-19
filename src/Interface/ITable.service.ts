import { Table } from 'src/Schema/table.shema';

export interface ITableService {
  findAll(): Promise<Table[]>;
  createTable(tableNumber: number): Promise<Table>;
  deleteTable(id: string): Promise<Table>;
  reserveTable(customerName: string, tableNumber: number): Promise<Table>;
  cancelReservation(tableId: string): Promise<Table>;
}
