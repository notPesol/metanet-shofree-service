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
import { CartItemService } from './service';
import { CartItemDTO } from './dto/dto';
import { BaseController } from 'src/common/controller/base.controller';
import { CartItemSearchDTO } from './dto/search.dto';
import { Request } from 'express';

@Controller('/cart-item')
export class CartItemController extends BaseController<CartItemDTO> {
  constructor(private readonly cartItemService: CartItemService) {
    super(cartItemService);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/me')
  async me(@Req() req: Request, @Query() searchDTO: CartItemSearchDTO) {
    return this.cartItemService.me(req, searchDTO);
  }
  
}
