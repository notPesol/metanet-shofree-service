import { Module } from '@nestjs/common';
import { CartItemService } from './service';
import { CartItemController } from './controller';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from 'src/common/sequelize/module';
import { CartItemRepository } from './repository';

@Module({
  imports: [ConfigModule, SequelizeModule],
  controllers: [CartItemController],
  providers: [CartItemService, CartItemRepository],
  exports: [CartItemService, CartItemRepository],
})
export class CartItemModule {}
