import { OrderItemAssociationDTO } from 'src/order-item/dto/dto';
import { OrderDTO } from 'src/order/dto/dto';

export class OrderAssociationDTO extends OrderDTO {
  orderItems: OrderItemAssociationDTO[];
}
