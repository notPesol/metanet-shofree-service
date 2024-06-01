import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { SearchDTO } from 'src/common/dto/search.dto';

export class OrderItemSearchDTO extends SearchDTO {
  @IsNumber()
  @IsOptional()
  @Transform(params => parseInt(params.value))
  orderId: number;
}
