import { IsEnum, IsNumber } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';
import { OrderStatus } from '../enum';

export class OrderDTO extends BaseDTO {
  @IsNumber()
  userId: number;

  @IsNumber()
  totalAmount: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
