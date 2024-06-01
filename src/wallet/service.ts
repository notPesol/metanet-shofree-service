import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { WalletService as CMSWalletService } from 'src/cms/services/wallet.service';

@Injectable()
export class WalletService {
  constructor(private readonly cmsWalletService: CMSWalletService) {}

  async myWallet(req: Request) {
    return this.cmsWalletService.myWallet(req.headers.authorization);
  }
}
