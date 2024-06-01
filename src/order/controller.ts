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
import { OrderService } from './service';
import { OrderDTO } from './dto/dto';
import { BaseController } from 'src/common/controller/base.controller';
import { OrderSearchDTO } from './dto/search.dto';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles';
import { Role } from 'src/common/enum';

@Controller('/order')
export class OrderController extends BaseController<OrderDTO> {
  constructor(private readonly orderService: OrderService) {
    super(orderService);
  }

  // @Roles(Role.Admin)
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @Get()
  // async findAll(@Query() searchDTO: OrderSearchDTO) {
  //   return this.orderService.findAll(searchDTO);
  // }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get("/me")
  async me(@Req() req: Request, @Query() searchDTO: OrderSearchDTO) {
    return this.orderService.me(req,searchDTO);
  }
}
