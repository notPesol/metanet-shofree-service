import { Injectable } from '@nestjs/common';
import { CartItemRepository } from 'src/cart-item/repository';
import { BaseAssociationRepository } from 'src/common/repository/base-association.repository';
import { OrderItemRepository } from 'src/order-item/repository';
import { OrderRepository } from 'src/order/repository';
import { ProductRepository } from 'src/product/repository';

export enum IncludeKey {
  orderOrderItem = 'order-order-item',
  orderOrderItemProduct = 'order-order-item-product',
  orderItemProduct = 'order-item-product',
}

@Injectable()
export class OrderAssociationRepository extends BaseAssociationRepository {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartItemRepository: CartItemRepository,
  ) {
    super();
  }

  protected init(): void {
    this.model = this.orderRepository.getModel();
  }

  protected setupAssociation(): void {
    const OrderModel = this.orderRepository.getModel();
    const OrderItemModel = this.orderItemRepository.getModel();
    const ProductModel = this.productRepository.getModel();
    const CartModel = this.cartItemRepository.getModel();

    OrderModel.hasMany(OrderItemModel, {
      foreignKey: 'orderId',
    });

    OrderItemModel.belongsTo(ProductModel, {
      foreignKey: 'productId',
    });

    CartModel.belongsTo(ProductModel, {
      foreignKey: 'productId',
    });
  }

  protected setupIncludeOptions(): void {
    this.includeOptions.set(IncludeKey.orderOrderItem, [
      {
        model: this.orderItemRepository.getModel(),
      },
    ]);
    this.includeOptions.set(IncludeKey.orderOrderItemProduct, [
      {
        model: this.orderItemRepository.getModel(),
        include: [
          {
            model: this.productRepository.getModel(),
          },
        ],
      },
    ]);
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
  getOrderRepository() {
    return this.orderRepository;
  }
  getOrderItemRepository() {
    return this.orderItemRepository;
  }
  getProductRepository() {
    return this.productRepository;
  }
  getCartItemRepository() {
    return this.cartItemRepository;
  }
}
