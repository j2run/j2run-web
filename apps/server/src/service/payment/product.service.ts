import { Injectable } from '@nestjs/common';
import { InjectModel, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductSearchRequest } from 'src/dtos/payment/product.dto';
import {
  ProductRetalOption,
  ProductRetalOptionDocument,
} from 'src/schema/payment/product-retal-option.schema';
import { Product, ProductDocument } from 'src/schema/payment/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(ProductRetalOption.name)
    private productRetalModel: Model<ProductRetalOptionDocument>,
  ) {
    // TODO
  }

  search(dto: ProductSearchRequest) {
    const productRetalCollectionName = this.productRetalModel.collection.name;
    return this.productModel
      .aggregate([
        {
          $match: {
            categoryId: dto.categoryId,
          },
        },
        {
          $lookup: {
            from: productRetalCollectionName,
            localField: '_id',
            foreignField: 'productId',
            as: 'retalOptions',
          },
        },
      ])
      .exec();
  }
}
