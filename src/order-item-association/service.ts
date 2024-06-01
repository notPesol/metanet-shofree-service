import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderItemAssociationRepository, IncludeKey } from './repository';
import { FindOptions } from 'sequelize';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { OrderItemAssociationSearchDTO } from './dto/search.dto';
import { OrderItemAssociationDTO } from 'src/order-item/dto/dto';

@Injectable()
export class OrderItemAssociationService {
  constructor(
    private readonly orderAssociationRepository: OrderItemAssociationRepository,
  ) {}

  private hasIncludeKey(key: IncludeKey): boolean {
    return Object.values(IncludeKey).includes(key);
  }

  async findAll(
    key: IncludeKey,
    searchDTO: OrderItemAssociationSearchDTO,
  ): Promise<ResponseDTO<OrderItemAssociationDTO[]>> {
    if (!this.hasIncludeKey(key)) {
      throw new BadRequestException('Include key not found.');
    }
    const where = {};
    const options = {};

    if (searchDTO.orderId) {
      where['orderId'] = searchDTO.orderId;
    }

    if (!searchDTO.ignorePage) {
      options['limit'] = searchDTO.limit;
      options['offset'] = (searchDTO.page - 1) * searchDTO.limit;
    }

    const responseDTO = new ResponseDTO<OrderItemAssociationDTO[]>();

    const includeOption = this.orderAssociationRepository.getIncludeOption(key);

    const findOptions: FindOptions = {
      where,
      ...options,
      include: includeOption,
    };

    if (searchDTO.count) {
      const { rows, count } =
        await this.orderAssociationRepository.findAndCountAll(findOptions);
      responseDTO.data = Object.assign([], rows);
      responseDTO.totalItem = count;
    } else {
      const rows = await this.orderAssociationRepository.findAll(findOptions);
      responseDTO.data = Object.assign([], rows);
    }

    return responseDTO;
  }
}
