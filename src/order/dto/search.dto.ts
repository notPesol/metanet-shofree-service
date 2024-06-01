import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SearchDTO } from 'src/common/dto/search.dto';
import { OrderStatus } from '../enum';

export class OrderSearchDTO extends SearchDTO {
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;
}
