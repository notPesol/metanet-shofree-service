import { BadRequestException, Injectable } from '@nestjs/common';
import { CartItemRepository } from './repository';
import { CartItemDTO } from './dto/dto';
import { BaseService } from 'src/common/service/base.service';
import { Request } from 'express';
import { CartItemSearchDTO } from './dto/search.dto';
import { ResponseDTO } from 'src/common/dto/response.dto';

@Injectable()
export class CartItemService extends BaseService<CartItemDTO> {
  constructor(private readonly cartItemRepository: CartItemRepository) {
    super(cartItemRepository);
  }

  async findAll(
    searchDTO: CartItemSearchDTO,
  ): Promise<ResponseDTO<CartItemDTO[]>> {
    const options = {};
    const where = {};

    if (searchDTO.userId) {
      where['userId'] = searchDTO.userId;
    }

    if (!searchDTO.ignorePage) {
      options['offset'] = (searchDTO.page - 1) * searchDTO.limit;
      options['limit'] = searchDTO.limit;
    }

    const responseDTO = new ResponseDTO<CartItemDTO[]>();

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
    searchDTO: CartItemSearchDTO,
  ): Promise<ResponseDTO<CartItemDTO[]>> {
    const user = req['user'];
    searchDTO.userId = user.id;
    
    return this.findAll(searchDTO);
  }
}
