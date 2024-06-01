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
import { OrderAssociationService } from './service';
import { IncludeKey } from './repository';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { OrderAssociationSearchDTO } from './dto/search.dto';
import { OrderAssociationDTO } from './dto/dto';
import { Roles } from 'src/common/decorator/roles';
import { Role } from 'src/common/enum';
import { Request } from 'express';

@Controller('/order-association')
export class OrderAssociationController {
  constructor(
    private readonly orderAssociationService: OrderAssociationService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(@Req() req: Request) {
    const result = await this.orderAssociationService.create(req['user'].id);
    const responseDTO = new ResponseDTO<OrderAssociationDTO>();
    responseDTO.data = result;
    return responseDTO;
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/payment/:orderId')
  async payment(@Req() req: Request, @Param('orderId') orderId: number) {
    const result = await this.orderAssociationService.payment(req, orderId);
    const responseDTO = new ResponseDTO<OrderAssociationDTO>();
    responseDTO.data = result;
    return responseDTO;
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/me/:view')
  async searchMe(
    @Req() req: Request,
    @Param('view') view: IncludeKey,
    @Query() searchDTO: OrderAssociationSearchDTO,
  ) {
    return this.orderAssociationService.searchMe(req, view, searchDTO);
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/me/:view/:id')
  async findByPkMe(
    @Req() req: Request,
    @Param('view') view: IncludeKey,
    @Param('id') id: number,
  ) {
    const result = await this.orderAssociationService.findByPkMe(req, view, id);
    const responseDTO = new ResponseDTO<OrderAssociationDTO>();
    responseDTO.data = result;
    return responseDTO;
  }

  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/:view')
  async findAll(
    @Param('view') view: IncludeKey,
    @Query() searchDTO: OrderAssociationSearchDTO,
  ) {
    const result = await this.orderAssociationService.findAll(view, searchDTO);
    return result;
  }

  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/:view/:id')
  async findByPk(@Param('view') view: IncludeKey, @Param('id') id: number) {
    const result = await this.orderAssociationService.findByPk(view, id);
    const responseDTO = new ResponseDTO<OrderAssociationDTO>();
    responseDTO.data = result;
    return responseDTO;
  }
}
