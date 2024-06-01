import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './services/authentication.service';
import { HttpModule } from '@nestjs/axios';
import { WalletService } from './services/wallet.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [],
  providers: [AuthenticationService, WalletService],
  exports: [AuthenticationService, WalletService],
})
export class CMSModule {}