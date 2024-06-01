import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './repository';
import { ProductDTO } from './dto/dto';
import { BaseService } from 'src/common/service/base.service';
import { Request } from 'express';
import { ProductSearchDTO } from './dto/search.dto';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductService extends BaseService<ProductDTO> {
  constructor(private readonly productRepository: ProductRepository) {
    super(productRepository);
  }

  async findAll(
    searchDTO: ProductSearchDTO,
  ): Promise<ResponseDTO<ProductDTO[]>> {
    const options = {};
    const where = {};

    if (searchDTO.query) {
      where['name'] = { [Op.like]: `%${searchDTO.query}%` };
    }

    if (!searchDTO.ignorePage) {
      options['offset'] = (searchDTO.page - 1) * searchDTO.limit;
      options['limit'] = searchDTO.limit;
    }

    const responseDTO = new ResponseDTO<ProductDTO[]>();

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
}
