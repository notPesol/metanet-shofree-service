import { Module } from '@nestjs/common';
import { ProductService } from './service';
import { ProductController } from './controller';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from 'src/common/sequelize/module';
import { ProductRepository } from './repository';

@Module({
  imports: [ConfigModule, SequelizeModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
