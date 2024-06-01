import { Injectable } from '@nestjs/common';
import { DataTypes } from 'sequelize';
import { BaseRepository } from 'src/common/repository/base.repositoty';
import { SequelizeService } from 'src/common/sequelize/service';

@Injectable()
export class OrderItemRepository extends BaseRepository {
  constructor(private readonly databaseService: SequelizeService) {
    super();
  }

  protected init(): void {
    this.model = this.databaseService.defineModel(
      'orderItem',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL,
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
      { tableName: 'order_items' },
    );
  }
}
