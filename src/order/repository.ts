import { Injectable } from '@nestjs/common';
import { DataTypes } from 'sequelize';
import { BaseRepository } from 'src/common/repository/base.repositoty';
import { SequelizeService } from 'src/common/sequelize/service';
import { OrderStatus } from './enum';

@Injectable()
export class OrderRepository extends BaseRepository {
  constructor(private readonly databaseService: SequelizeService) {
    super();
  }

  protected init(): void {
    this.model = this.databaseService.defineModel(
      'order',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        totalAmount: {
          type: DataTypes.DECIMAL,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(OrderStatus)),
          allowNull: false,
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: () => new Date(),
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: () => new Date(),
        },
      },
      { tableName: 'orders' },
    );
  }
}
