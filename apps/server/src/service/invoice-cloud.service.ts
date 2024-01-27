import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import {
  InvoiceCloudSearchRequest,
  InvoiceCloudViewedRequest,
} from 'src/dtos/invoice-cloud.dto';
import {
  InvoiceCloud,
  InvoiceCloudDocument,
} from 'src/schema/invoice-cloud.schema';
import { UserDocument } from 'src/schema/user.schema';

@Injectable()
export class InvoiceCloudService {
  constructor(
    @InjectModel(InvoiceCloud.name)
    private invoiceCloudModel: Model<InvoiceCloudDocument>,
  ) {}

  async search(dto: InvoiceCloudSearchRequest, user: UserDocument) {
    const filterQuery: FilterQuery<InvoiceCloudDocument> = {
      userId: new Types.ObjectId(user._id),
    };

    if (dto.status) {
      filterQuery.status = {
        $in: dto.status,
      };
    }

    if (dto.notViewed) {
      filterQuery.$or = [
        {
          isViewed: {
            $exists: false,
          },
        },
        {
          isViewed: {
            $eq: null,
          },
        },
      ];
    }

    return this.invoiceCloudModel.find(filterQuery);
  }

  async viewed(dto: InvoiceCloudViewedRequest, user: UserDocument) {
    const ic = await this.invoiceCloudModel.findOne({
      _id: new Types.ObjectId(dto.invoiceCloudId),
      userId: new Types.ObjectId(user._id),
    });
    if (!ic) {
      throw new ForbiddenException();
    }
    ic.isViewed = true;
    return await this.invoiceCloudModel.bulkSave([ic]);
  }
}
