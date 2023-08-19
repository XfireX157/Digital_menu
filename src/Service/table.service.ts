import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Table, TableDocument } from '../Schema/table.shema';
import { ITableService } from 'src/Interface/ITable.service';

@Injectable()
export class TableService implements ITableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async findAll(): Promise<Table[]> {
    const find = await this.tableModel.find().exec();

    if (!find.length) {
      throw new ForbiddenException('Não existe nenhum menu criado');
    }

    return find;
  }

  async createTable(tableNumber: number): Promise<Table> {
    const _id = new Types.ObjectId();
    const findTableExist = await this.tableModel.findOne({
      tableNumber,
    });
    if (findTableExist) {
      throw new ForbiddenException('Essa mesa já existe');
    }
    return this.tableModel.create({
      _id,
      tableNumber,
    });
  }

  async deleteTable(id: string): Promise<Table> {
    const findId = await this.tableModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!findId) {
      throw new ForbiddenException('Não existe nenhuma mesa com esse id');
    }
    await this.tableModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
    return findId;
  }

  async reserveTable(
    customerName: string,
    tableNumber: number,
  ): Promise<Table> {
    const table = await this.tableModel.findOne({
      tableNumber: tableNumber,
      available: true,
    });
    if (!table) {
      throw new NotFoundException(
        `A mesa ${tableNumber} não está disponível para reserva`,
      );
    }

    table.available = false;
    table.reservedByName = customerName;
    table.reservationTime = new Date();
    return table.save();
  }

  async cancelReservation(tableId: string): Promise<Table> {
    const table = await this.tableModel.findOne({
      _id: new Types.ObjectId(tableId),
    });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada');
    }

    table.available = true;
    table.reservedByName = undefined;
    table.reservationTime = undefined;
    return table.save();
  }
}
