import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { TableController } from '../Controller/table.controller';
import { Table } from '../Schema/table.shema';
import { TableService } from '../Service/table.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const newTable: Table[] = [
  {
    _id: new Types.ObjectId(),
    tableNumber: 12,
    available: false,
    reservedByName: 'Gustavo',
    reservationTime: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    tableNumber: 10,
    available: true,
    reservedByName: 'Luiz',
    reservationTime: new Date(),
  },
];

describe('TableService', () => {
  let tableController: TableController;
  let tableService: TableService;
  let tableModel: Model<Table>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableController],
      providers: [
        TableService,
        {
          provide: getModelToken(Table.name),
          useValue: {
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(newTable),
            }),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            deleteOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(newTable[0]),
            }),
          },
        },
      ],
    }).compile();

    tableController = module.get<TableController>(TableController);
    tableService = module.get<TableService>(TableService);
    tableModel = module.get<Model<Table>>(getModelToken(Table.name));
  });

  it('Should be defined', () => {
    expect(tableController).toBeDefined();
    expect(tableService).toBeDefined();
    expect(tableModel).toBeDefined();
  });

  describe('findAll', () => {
    it('hope he returns every table', async () => {
      const result = await tableService.findAll();

      expect(result).toEqual(newTable);
    });

    it('i expect to return an empty array', async () => {
      jest.spyOn(tableModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      expect(tableService.findAll()).rejects.toThrowError(
        new ForbiddenException('Não existe nenhum menu criado'),
      );
    });
  });

  describe('create', () => {
    it('i hope to create a new table', async () => {
      const tableNumber = 1;

      jest.spyOn(tableModel, 'findOne').mockResolvedValueOnce(null);
      (tableModel.create as jest.Mock).mockResolvedValueOnce(newTable[0]);

      const result = await tableService.createTable(tableNumber);

      expect(result).toEqual(newTable[0]);
    });

    it('I expect to get an error with already existing table', async () => {
      const tableNumber = 1;

      jest.spyOn(tableModel, 'findOne').mockResolvedValueOnce(newTable[0]);

      expect(tableService.createTable(tableNumber)).rejects.toThrow(
        new ForbiddenException('Essa mesa já existe'),
      );
    });
  });

  describe('delete', () => {
    it('Hope to delete a table', async () => {
      const _id = new Types.ObjectId().toString();
      jest.spyOn(tableModel, 'findOne').mockResolvedValueOnce(newTable[0]);

      const result = await tableService.deleteTable(_id);

      expect(result).toEqual(newTable[0]);
    });

    it('I expect to get a table not existing error', async () => {
      const _id = new Types.ObjectId().toString();
      jest.spyOn(tableModel, 'findOne').mockResolvedValueOnce(null);

      expect(tableService.deleteTable(_id)).rejects.toThrow(
        new ForbiddenException('Não existe nenhuma mesa com esse id'),
      );
    });
  });

  describe('reserveTable', () => {
    it('I hope to reserve a table', async () => {
      const customerName = 'John Does';
      const tableNumber = 1;
      const mockTable = {
        _id: 'some-id',
        tableNumber,
        available: true,
        reservedByName: undefined,
        reservationTime: undefined,
        save: jest.fn().mockReturnThis(),
      };

      (tableModel.findOne as jest.Mock).mockResolvedValue(mockTable);

      const result = await tableService.reserveTable(customerName, tableNumber);

      expect(result).toEqual(mockTable);
      expect(mockTable.available).toBe(false);
      expect(mockTable.reservedByName).toBe(customerName);
      expect(mockTable.reservationTime).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException if the table is not available for reservation', async () => {
      const customerName = 'John Doe';
      const tableNumber = 1;
      const mockTable = {
        _id: new Types.ObjectId().toString(),
        tableNumber,
        available: false, // Set the table as unavailable
        reservedByName: 'Another Customer',
        reservationTime: new Date(),
        save: jest.fn().mockImplementation(function () {
          // Implement the save function to return a rejected promise with NotFoundException
          return Promise.reject(
            new NotFoundException('Table not available for reservation'),
          );
        }),
      };

      (tableModel.findOne as jest.Mock).mockResolvedValue(mockTable);

      await expect(
        tableService.reserveTable(customerName, tableNumber),
      ).rejects.toThrowError(NotFoundException);

      expect(mockTable.save).toHaveBeenCalledTimes(1);
    });
  });
  describe('cancelReservation', () => {
    it('I hope to cancel the reserved table', async () => {
      const tableId = new Types.ObjectId().toString();
      const mockTable = {
        _id: tableId, // Use tableId directly as the _id field
        tableNumber: 1,
        available: false,
        reservedByName: 'John Doe',
        reservationTime: new Date(),
        save: jest.fn().mockReturnThis(),
      };

      (tableModel.findOne as jest.Mock).mockResolvedValue(mockTable);

      const result = await tableService.cancelReservation(tableId);

      expect(result).toEqual(mockTable);
      expect(mockTable.available).toBe(true);
      expect(mockTable.reservedByName).toBeUndefined();
      expect(mockTable.reservationTime).toBeUndefined();
    });

    it('should throw NotFoundException if the table with given id is not found', async () => {
      const tableId = new Types.ObjectId().toString();

      (tableModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        tableService.cancelReservation(tableId),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
