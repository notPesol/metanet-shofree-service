import { Module } from '@nestjs/common';
import { OrderAssociationRepository } from './repository';
import { OrderItemModule } from 'src/order-item/module';
import { OrderModule } from 'src/order/module';
import { ProductModule } from 'src/product/module';
import { OrderAssociationService } from './service';
import { OrderAssociationController } from './controller';
import { CartItemModule } from 'src/cart-item/module';
import { CMSModule } from 'src/cms/module';

@Module({
  imports: [OrderModule, OrderItemModule, ProductModule, CartItemModule, CMSModule],
  controllers: [OrderAssociationController],
  providers: [OrderAssociationRepository, OrderAssociationService],
  exports: [OrderAssociationRepository, OrderAssociationService],
})
export class OrderAssociationModule {}
