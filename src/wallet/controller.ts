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
import { WalletService } from './service';
import { Request } from 'express';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { WalletDTO } from './dto/dto';

@Controller('/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/me')
  async myWallet(@Req() req: Request): Promise<ResponseDTO<WalletDTO>> {
    return this.walletService.myWallet(req);
  }
}
