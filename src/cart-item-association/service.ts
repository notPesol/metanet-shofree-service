import { BadRequestException, Injectable } from '@nestjs/common';
import { CartItemAssociationRepository, IncludeKey } from './repository';
import { CartItemAssociationDTO } from './dto/dto';
import { FindOptions } from 'sequelize';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { CartItemAssociationSearchDTO } from './dto/search.dto';
import { Request } from 'express';

@Injectable()
export class CartItemAssociationService {
  constructor(
    private readonly cartItemAssociationRepository: CartItemAssociationRepository,
  ) {}

  private hasIncludeKey(key: IncludeKey): boolean {
    return Object.values(IncludeKey).includes(key);
  }

  async findByPk(key: IncludeKey, id: number): Promise<CartItemAssociationDTO> {
    if (!this.hasIncludeKey(key)) {
      throw new BadRequestException('Include key not found.');
    }

    const includeOption =
      this.cartItemAssociationRepository.getIncludeOption(key);
    const model = await this.cartItemAssociationRepository.findOne({
      include: includeOption,
      where: { id },
    });

    return new CartItemAssociationDTO(model);
  }

  async findAll(
    key: IncludeKey,
    searchDTO: CartItemAssociationSearchDTO,
  ): Promise<ResponseDTO<CartItemAssociationDTO[]>> {
    if (!this.hasIncludeKey(key)) {
      throw new BadRequestException('Include key not found.');
    }
    const where = {};
    const options = {};

    if (searchDTO.userId) {
      where['userId'] = searchDTO.userId;
    }

    if (!searchDTO.ignorePage) {
      options['limit'] = searchDTO.limit;
      options['offset'] = (searchDTO.page - 1) * searchDTO.limit;
    }

    const responseDTO = new ResponseDTO<CartItemAssociationDTO[]>();

    const includeOption =
      this.cartItemAssociationRepository.getIncludeOption(key);

    const findOptions: FindOptions = {
      where,
      ...options,
      include: includeOption,
    };

    if (searchDTO.count) {
      const { rows, count } =
        await this.cartItemAssociationRepository.findAndCountAll(findOptions);
      responseDTO.data = Object.assign([], rows);
      responseDTO.totalItem = count;
    } else {
      const rows =
        await this.cartItemAssociationRepository.findAll(findOptions);
      responseDTO.data = Object.assign([], rows);
    }

    return responseDTO;
  }

  async searchMe(
    req: Request,
    key: IncludeKey,
    searchDTO: CartItemAssociationSearchDTO,
  ): Promise<ResponseDTO<CartItemAssociationDTO[]>> {
    const user = req['user'];
    searchDTO.userId = user.id;
    return this.findAll(key, searchDTO);
  }
}
