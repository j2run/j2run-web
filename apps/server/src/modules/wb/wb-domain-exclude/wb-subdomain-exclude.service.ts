import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WbSubdomainExclude,
  WbSubdomainExcludeDocument,
} from 'src/schema/web-builder/wb-subdomain-exclude.schema';

@Injectable()
export class WbSubdomainExcludeService {
  constructor(
    @InjectModel(WbSubdomainExclude.name)
    private wbSubdomainExcludeModel: Model<WbSubdomainExcludeDocument>,
  ) {}

  isExclude(subdomain: string) {
    return this.wbSubdomainExcludeModel
      .find({
        subdomain,
      })
      .then((result) => !!result && result.length > 0);
  }
}
