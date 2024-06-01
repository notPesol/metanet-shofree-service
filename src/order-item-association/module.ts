import { Module } from '@nestjs/common';
import { OrderItemAssociationRepository } from './repository';
import { OrderItemModule } from 'src/order-item/module';
import { ProductModule } from 'src/product/module';
import { OrderItemAssociationService } from './service';
import { OrderItemAssociationController } from './controller';

@Module({
  imports: [OrderItemModule, ProductModule],
  controllers: [OrderItemAssociationController],
  providers: [OrderItemAssociationRepository, OrderItemAssociationService],
  exports: [OrderItemAssociationRepository, OrderItemAssociationService],
})
export class OrderItemAssociationModule {}
