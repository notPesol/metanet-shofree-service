import { IsEnum, IsNumber } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';
import { ProductDTO } from 'src/product/dto/dto';

export class OrderItemDTO extends BaseDTO {
  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class OrderItemAssociationDTO extends OrderItemDTO {
  product: ProductDTO;
}
