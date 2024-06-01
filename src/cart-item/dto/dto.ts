import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';
import { ProductDTO } from 'src/product/dto/dto';

export class CartItemDTO extends BaseDTO {
  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;
  
  @IsNumber()
  quantity: number;
}

export class CartItemAssociationDTO extends CartItemDTO {
  product: ProductDTO;
}
