import { Module } from '@nestjs/common';
import { AuthenticationService } from './service';
import { AuthenticationController } from './controller';
import { CMSModule } from 'src/cms/module';

@Module({
  imports: [CMSModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
