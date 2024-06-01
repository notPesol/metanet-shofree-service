import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './service';
import { ProductDTO } from './dto/dto';
import { BaseController } from 'src/common/controller/base.controller';
import { ProductSearchDTO } from './dto/search.dto';

@Controller('/product')
export class ProductController extends BaseController<ProductDTO> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(@Query() searchDTO: ProductSearchDTO) {
    return this.productService.findAll(searchDTO);
  }

}
