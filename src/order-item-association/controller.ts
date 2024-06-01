import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderItemAssociationService } from './service';
import { IncludeKey } from './repository';
import { OrderItemAssociationSearchDTO } from './dto/search.dto';

@Controller('/order-item-association')
export class OrderItemAssociationController {
  constructor(
    private readonly orderItemAssociationService: OrderItemAssociationService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/:view')
  async findAll(
    @Param('view') view: IncludeKey,
    @Query() searchDTO: OrderItemAssociationSearchDTO,
  ) {
    const result = await this.orderItemAssociationService.findAll(
      view,
      searchDTO,
    );
    return result;
  }
}
