import { Module } from '@nestjs/common';
import { CartItemAssociationRepository } from './repository';
import { ProductModule } from 'src/product/module';
import { CartItemAssociationService } from './service';
import { OrderAssociationController } from './controller';
import { CartItemModule } from 'src/cart-item/module';

@Module({
  imports: [ProductModule, CartItemModule],
  controllers: [OrderAssociationController],
  providers: [CartItemAssociationRepository, CartItemAssociationService],
  exports: [CartItemAssociationRepository, CartItemAssociationService],
})
export class CartItemAssociationModule {}
