import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderAssociationRepository, IncludeKey } from './repository';
import { OrderAssociationDTO } from './dto/dto';
import { FindOptions } from 'sequelize';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { OrderAssociationSearchDTO } from './dto/search.dto';
import { Request } from 'express';
import { CartItemAssociationDTO, CartItemDTO } from 'src/cart-item/dto/dto';
import { OrderDTO } from 'src/order/dto/dto';
import { OrderStatus } from 'src/order/enum';
import { OrderItemDTO } from 'src/order-item/dto/dto';
import { WalletService } from 'src/cms/services/wallet.service';
import { TransactionType } from 'src/transaction/enum';

@Injectable()
export class OrderAssociationService {
  constructor(
    private readonly orderAssociationRepository: OrderAssociationRepository,
    private readonly walletService: WalletService,
  ) {}

  private hasIncludeKey(key: IncludeKey): boolean {
    return Object.values(IncludeKey).includes(key);
  }

  async create(userId: number) {
    if (!userId) {
      throw new UnauthorizedException();
    }

    const sqTransaction = await this.orderAssociationRepository
      .getModel()
      .sequelize.transaction();
    try {
      const options = { transaction: sqTransaction };

      const cartInclude = this.orderAssociationRepository.getIncludeOption(
        IncludeKey.orderItemProduct,
      );
      const cartItemModels = await this.orderAssociationRepository
        .getCartItemRepository()
        .findAll({ where: { userId }, include: cartInclude });

      if (cartItemModels.length === 0) {
        throw new BadRequestException('The cart is empty.');
      }

      const cartItems = cartItemModels.map(
        (e) => new CartItemAssociationDTO(e),
      );

      const totalAmount = cartItems.reduce(
        (prev, cartItem) => prev + cartItem.product.price * cartItem.quantity,
        0,
      );

      // สร้าง order
      let order = new OrderDTO(null);
      order.userId = userId;
      order.totalAmount = totalAmount;
      order.status = OrderStatus.pending;
      const orderModel = await this.orderAssociationRepository.create(
        order,
        options,
      );
      order = new OrderDTO(orderModel);

      for (const cartItem of cartItems) {
        // สร้าง orderItem
        const orderItem = new OrderItemDTO(null);
        orderItem.orderId = order.id;
        orderItem.productId = cartItem.productId;
        orderItem.price = cartItem.product.price;
        orderItem.quantity = cartItem.quantity;
        await this.orderAssociationRepository
          .getOrderItemRepository()
          .create(orderItem, options);

        if (cartItem.product.stock < cartItem.quantity) {
          throw new ConflictException(
            `Insufficient stock for product ${cartItem.product.name}`,
          );
        }

        // ตัด product stock
        const product = cartItem.product;
        product.stock -= cartItem.quantity;
        product.updatedAt = new Date();
        await this.orderAssociationRepository
          .getProductRepository()
          .getModel()
          .update(product, { where: { id: product.id }, ...options });
      }

      // เคลียตะกร้า
      await this.orderAssociationRepository
        .getCartItemRepository()
        .getModel()
        .destroy({ where: { userId }, ...options });

      await sqTransaction.commit();

      return this.findByPk(IncludeKey.orderOrderItemProduct, order.id);
    } catch (error) {
      console.log(error);
      await sqTransaction.rollback();
      throw error;
    }
  }
  async payment(req: Request, orderId: number) {
    const user = req['user'];
    if (!user || !user.id || !orderId) {
      throw new UnauthorizedException();
    }

    const sqTransaction = await this.orderAssociationRepository
      .getModel()
      .sequelize.transaction();
    try {
      const options = { transaction: sqTransaction };

      // ค้นหาออเดอร์
      const orderModel = await this.orderAssociationRepository.findOne({
        where: { id: orderId, userId: user.id, status: OrderStatus.pending },
      });

      if (!orderModel) {
        throw new ConflictException(`Order not found or already paid`);
      }

      const order = new OrderDTO(orderModel);

      // เช็คจำนวนเงินจาก wallet
      const { data: wallet } = await this.walletService.myWallet(
        req.headers.authorization,
      );
      if (+wallet?.balance < +order.totalAmount) {
        throw new BadRequestException(
          'There is not enough money in the wallet.',
        );
      }

      // จ่ายตัง ยิงไปยัง cms backend
      await this.walletService.payment(req.headers.authorization, {
        amount: +order.totalAmount,
        transactionType: TransactionType.payment
      });

      // อัพเดท order status
      order.status = OrderStatus.paid;
      order.updatedAt = new Date();
      await this.orderAssociationRepository
        .getModel()
        .update(order, { where: { id: order.id }, ...options });

      await sqTransaction.commit();

      return this.findByPk(IncludeKey.orderOrderItemProduct, orderId);
    } catch (error) {
      console.log(error);
      await sqTransaction.rollback();
      throw error;
    }
  }

  async findByPk(key: IncludeKey, id: number): Promise<OrderAssociationDTO> {
    if (!this.hasIncludeKey(key)) {
      throw new BadRequestException('Include key not found.');
    }

    const includeOption = this.orderAssociationRepository.getIncludeOption(key);
    const model = await this.orderAssociationRepository.findOne({
      include: includeOption,
      where: { id },
    });

    return new OrderAssociationDTO(model);
  }

  async findAll(
    key: IncludeKey,
    searchDTO: OrderAssociationSearchDTO,
  ): Promise<ResponseDTO<OrderAssociationDTO[]>> {
    if (!this.hasIncludeKey(key)) {
      throw new BadRequestException('Include key not found.');
    }
    const where = {};
    const options = {};

    if (searchDTO.userId) {
      where['userId'] = searchDTO.userId;
    }
    if (searchDTO.status) {
      where['status'] = searchDTO.status;
    }

    if (!searchDTO.ignorePage) {
      options['limit'] = searchDTO.limit;
      options['offset'] = (searchDTO.page - 1) * searchDTO.limit;
    }

    const responseDTO = new ResponseDTO<OrderAssociationDTO[]>();

    const includeOption = this.orderAssociationRepository.getIncludeOption(key);

    const findOptions: FindOptions = {
      where,
      ...options,
      include: includeOption,
    };

    if (searchDTO.count) {
      const { rows, count } =
        await this.orderAssociationRepository.findAndCountAll(findOptions);
      responseDTO.data = Object.assign([], rows);
      responseDTO.totalItem = count;
    } else {
      const rows = await this.orderAssociationRepository.findAll(findOptions);
      responseDTO.data = Object.assign([], rows);
    }

    return responseDTO;
  }

  async searchMe(
    req: Request,
    key: IncludeKey,
    searchDTO: OrderAssociationSearchDTO,
  ): Promise<ResponseDTO<OrderAssociationDTO[]>> {
    const user = req['user'];
    searchDTO.userId = user.id;
    return this.findAll(key, searchDTO);
  }

  async findByPkMe(
    req: Request,
    key: IncludeKey,
    id: number,
  ): Promise<OrderAssociationDTO> {
    if (!this.hasIncludeKey(key)) {
      throw new BadRequestException('Include key not found.');
    }

    const user = req['user'];
    const includeOption = this.orderAssociationRepository.getIncludeOption(key);
    const model = await this.orderAssociationRepository.findOne({
      include: includeOption,
      where: { id, userId: user.id },
    });

    return new OrderAssociationDTO(model);
  }
}
