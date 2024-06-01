import { Injectable } from '@nestjs/common';
import { OrderRepository } from './repository';
import { OrderDTO } from './dto/dto';
import { BaseService } from 'src/common/service/base.service';
import { Request } from 'express';
import { OrderSearchDTO } from './dto/search.dto';
import { ResponseDTO } from 'src/common/dto/response.dto';

@Injectable()
export class OrderService extends BaseService<OrderDTO> {
  constructor(private readonly orderRepository: OrderRepository) {
    super(orderRepository);
  }

  async findAll(searchDTO: OrderSearchDTO): Promise<ResponseDTO<OrderDTO[]>> {
    const options = {};
    const where = {};

    if (searchDTO.userId) {
      where['userId'] = searchDTO.userId;
    }

    if (searchDTO.status) {
      where['status'] = searchDTO.status;
    }

    if (!searchDTO.ignorePage) {
      options['offset'] = (searchDTO.page - 1) * searchDTO.limit;
      options['limit'] = searchDTO.limit;
    }

    const responseDTO = new ResponseDTO<OrderDTO[]>();

    const findOptions = {
      where,
      ...options,
    };

    if (searchDTO.count) {
      const { rows, count } = await this.findAndCountAll(findOptions);
      responseDTO.totalItem = count;
      responseDTO.data = rows.map((model) => this.toJson(model));
    } else {
      const rows = await this.getAll(findOptions);
      responseDTO.data = rows;
    }

    return responseDTO;
  }
  async me(
    req: Request,
    searchDTO: OrderSearchDTO,
  ): Promise<ResponseDTO<OrderDTO[]>> {
    const user = req['user'];
    searchDTO.userId = user.id;
    return this.findAll(searchDTO);
  }
}
