import { Module } from '@nestjs/common';
import { WalletService } from './service';
import { WalletController } from './controller';
import { CMSModule } from 'src/cms/module';

@Module({
  imports: [CMSModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
