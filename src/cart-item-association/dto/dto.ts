import { OrderDTO } from 'src/order/dto/dto';
import { ProductDTO } from 'src/product/dto/dto';

export class CartItemAssociationDTO extends OrderDTO {
  product: ProductDTO;
}
