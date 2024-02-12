import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StatusResponse } from 'src/dtos/common.dto';
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

  newSubdomainValid(search: NewSubdomainValidRequest): Promise<StatusResponse> {
    return this.wbWebsiteModel
      .find({
        wbDomainId: new Types.ObjectId(search.wbDomainId),
        subdomain: search.subdomain,
      })
      .then((result) => ({ status: !!result && result.length === 0 }));
  }
}
