import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSearchRequest } from 'src/dtos/payment/product.dto';
import { ProductEntity } from 'src/schema/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
  ) {}

  search(dto: ProductSearchRequest) {
    return this.productEntityRepository.find({
      where: {
        category: {
          id: dto.categoryId,
        },
      },
      relations: {
        productRetalOptions: true,
      },
    });
  }
}
