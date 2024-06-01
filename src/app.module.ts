import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './common/config/configuration';
import { SequelizeModule } from './common/sequelize/module';
import { AuthGuard } from './common/guard/auth.guard';

import { RolesGuard } from './common/guard/roles.guard';

import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { CMSModule } from './cms/module';
import { AuthenticationModule } from './authentication/module';
import { ProductModule } from './product/module';
import { CartItemModule } from './cart-item/module';
import { OrderModule } from './order/module';
import { OrderItemModule } from './order-item/module';
import { OrderAssociationModule } from './order-association/module';
import { WalletModule } from './wallet/module';
import { CartItemAssociationModule } from './cart-item-association/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SequelizeModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: { expiresIn: '7d' }, // Set your desired sign options
        };
      },
    }),
    HttpModule,
    CMSModule,
    AuthenticationModule,
    ProductModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    OrderAssociationModule,
    WalletModule,
    CartItemAssociationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
