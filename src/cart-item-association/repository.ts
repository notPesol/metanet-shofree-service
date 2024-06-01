import { Injectable } from '@nestjs/common';
import { CartItemRepository } from 'src/cart-item/repository';
import { BaseAssociationRepository } from 'src/common/repository/base-association.repository';
import { ProductRepository } from 'src/product/repository';

export enum IncludeKey {
  cartItemProduct = 'cart-item-product',
}

@Injectable()
export class CartItemAssociationRepository extends BaseAssociationRepository {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cartItemRepository: CartItemRepository,
  ) {
    super();
  }

  protected init(): void {
    this.model = this.cartItemRepository.getModel();
  }

  protected setupAssociation(): void {
    const ProductModel = this.productRepository.getModel();
    const CartModel = this.cartItemRepository.getModel();

    CartModel.belongsTo(ProductModel, {
      foreignKey: 'productId',
    });
  }

  protected setupIncludeOptions(): void {
    this.includeOptions.set(IncludeKey.cartItemProduct, [
      {
        model: this.productRepository.getModel(),
      },
    ]);
  }

  getIncludeOption(key: string) {
    return this.includeOptions.get(key);
  }

  // util method
  getProductRepository() {
    return this.productRepository;
  }
  getCartItemRepository() {
    return this.cartItemRepository;
  }
}
