import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ServicesModule } from 'src/service/services.module';

@Module({
  imports: [ServicesModule, SchemaModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
