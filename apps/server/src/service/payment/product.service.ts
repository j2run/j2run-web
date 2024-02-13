import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
    @InjectConnection() private readonly connection: mongoose.Connection,
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
