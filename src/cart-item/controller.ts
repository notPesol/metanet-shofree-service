import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { ResponseDTO } from 'src/common/dto/response.dto';

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

  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete('/me/:id')
  async deleteByIdMe(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<ResponseDTO<number>> {
    const deletedCount = await this.cartItemService.deleteByIdMe(req, id);
    const responseDTO = new ResponseDTO<number>();
    responseDTO.data = deletedCount;
    return responseDTO;
  }
}
