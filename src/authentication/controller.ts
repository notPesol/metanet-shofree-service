import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './service';
import { Public } from 'src/common/decorator/public';
import { AuthenticationDTO } from './dto/dto';
import { Request } from 'express';

@Controller('/authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Public()
  @Post('/login')
  async login(@Body(new ValidationPipe()) body: AuthenticationDTO) {
    return this.authService.login(body);
  }

  @Get('/profile')
  async profile(@Req() req: Request) {
    return this.authService.profile(req);
  }
}
