import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartItemAssociationService } from './service';
import { IncludeKey } from './repository';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { CartItemAssociationSearchDTO } from './dto/search.dto';
import { CartItemAssociationDTO } from './dto/dto';
import { Roles } from 'src/common/decorator/roles';
import { Role } from 'src/common/enum';
import { Request } from 'express';

@Controller('/cart-item-association')
export class OrderAssociationController {
  constructor(
    private readonly cartItemAssociationService: CartItemAssociationService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/me/:view')
  async searchMe(
    @Req() req: Request,
    @Param('view') view: IncludeKey,
    @Query() searchDTO: CartItemAssociationSearchDTO,
  ) {
    return this.cartItemAssociationService.searchMe(req, view, searchDTO);
  }

  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/:view')
  async findAll(
    @Param('view') view: IncludeKey,
    @Query() searchDTO: CartItemAssociationSearchDTO,
  ) {
    const result = await this.cartItemAssociationService.findAll(view, searchDTO);
    return result;
  }

  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/:view/:id')
  async findByPk(@Param('view') view: IncludeKey, @Param('id') id: number) {
    const result = await this.cartItemAssociationService.findByPk(view, id);
    const responseDTO = new ResponseDTO<CartItemAssociationDTO>();
    responseDTO.data = result;
    return responseDTO;
  }
}
