import { Module } from '@nestjs/common';
import { OrderService } from './service';
import { OrderController } from './controller';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from 'src/common/sequelize/module';
import { OrderRepository } from './repository';

@Module({
  imports: [ConfigModule, SequelizeModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
