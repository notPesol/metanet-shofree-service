import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDTO } from 'src/common/dto/base.dto';

export class ProductDTO extends BaseDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;
}
