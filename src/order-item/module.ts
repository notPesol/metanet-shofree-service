import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from 'src/common/sequelize/module';
import { OrderItemRepository } from './repository';

@Module({
  imports: [ConfigModule, SequelizeModule],
  controllers: [],
  providers: [OrderItemRepository],
  exports: [OrderItemRepository],
})
export class OrderItemModule {}
