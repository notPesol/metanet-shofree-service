import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UpdateWalletDTO } from 'src/wallet/dto/dto';
import { AuthenticationDTO } from 'src/authentication/dto/dto';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

interface ICMSConfig {
  host: string;
}

@Injectable()
export class AuthenticationService {
  private baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const cmsConfig = configService.get<ICMSConfig>('cms');
    this.baseUrl = `${cmsConfig.host}/authentication`;
  }

  async login(body: AuthenticationDTO) {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}/login`, body, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async profile(authorization: string) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: authorization,
    };

    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/profile`, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
