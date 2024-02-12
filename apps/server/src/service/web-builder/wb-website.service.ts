import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NewSubdomainValidRequest } from 'src/dtos/wb/wb-website.dto';
import {
  WbWebsite,
  WbWebsiteDocument,
} from 'src/schema/web-builder/wb-website.schema';

@Injectable()
export class WbWebsiteService {
  constructor(
    @InjectModel(WbWebsite.name)
    private wbWebsiteModel: Model<WbWebsiteDocument>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  newSubdomainValid(search: NewSubdomainValidRequest) {
    return this.wbWebsiteModel.find({
      wbDomainId: new Types.ObjectId(search.wbDomainId),
      subdomain: search.subdomain,
    });
  }
}
