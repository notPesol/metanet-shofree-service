import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UpdateWalletDTO } from 'src/wallet/dto/dto';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { TransactionType } from 'src/transaction/enum';

interface ICMSConfig {
  host: string;
}

@Injectable()
export class WalletService {
  private baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const cmsConfig = configService.get<ICMSConfig>('cms');
    this.baseUrl = `${cmsConfig.host}/wallet`;
  }

  async myWallet(authorization: string) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: authorization,
    };

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/me`, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async payment(authorization: string, body: UpdateWalletDTO) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: authorization,
    };

    // บังคับให้เป็น type payment
    body.transactionType = TransactionType.payment;

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}`, body, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
