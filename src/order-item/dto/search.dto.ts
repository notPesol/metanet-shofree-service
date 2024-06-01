import { IsNumber, IsOptional } from 'class-validator';
import { SearchDTO } from 'src/common/dto/search.dto';

export class OrderItemSearchDTO extends SearchDTO {
  @IsNumber()
  @IsOptional()
  orderId: number;
}
