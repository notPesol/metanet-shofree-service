import { Injectable } from '@nestjs/common';
import { BaseAssociationRepository } from 'src/common/repository/base-association.repository';
import { OrderItemRepository } from 'src/order-item/repository';
import { ProductRepository } from 'src/product/repository';

export enum IncludeKey {
  orderItemProduct = 'order-item-product',
}

@Injectable()
export class OrderItemAssociationRepository extends BaseAssociationRepository {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly productRepository: ProductRepository,
  ) {
    super();
  }

  protected init(): void {
    this.model = this.orderItemRepository.getModel();
  }

  protected setupAssociation(): void {
    const OrderItemModel = this.orderItemRepository.getModel();
    const ProductModel = this.productRepository.getModel();

    OrderItemModel.belongsTo(ProductModel, {
      foreignKey: 'productId',
    });
  }

  protected setupIncludeOptions(): void {
    this.includeOptions.set(IncludeKey.orderItemProduct, [
      {
        model: this.productRepository.getModel(),
      },
    ]);
  }

  getIncludeOption(key: string) {
    return this.includeOptions.get(key);
  }

  // util method
  getOrderItemRepository() {
    return this.orderItemRepository;
  }
  getProductRepository() {
    return this.productRepository;
  }
}
