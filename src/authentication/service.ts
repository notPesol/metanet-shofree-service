import { Injectable } from '@nestjs/common';
import { UserAssociationDTO } from 'src/user-association/dto/dto';
import { AuthenticationDTO } from './dto/dto';
import { Request } from 'express';
import { AuthenticationService as CMSAuthenticationService } from '../cms/services/authentication.service';
import { ResponseDTO } from 'src/common/dto/response.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly cmsAuthenticationService: CMSAuthenticationService,
  ) {}

  async login(body: AuthenticationDTO) {
    return this.cmsAuthenticationService.login(body);
  }

  async profile(req: Request): Promise<ResponseDTO<UserAssociationDTO>> {
    return this.cmsAuthenticationService.profile(req.headers.authorization);
  }
}
