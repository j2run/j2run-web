import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WbSubdomainExclude,
  WbSubdomainExcludeDocument,
} from 'src/schema/wb-subdomain-exclude.schema';

@Injectable()
export class WbSubdomainExcludeService {
  constructor(
    @InjectModel(WbSubdomainExclude.name)
    private WbSubdomainExcludeModel: Model<WbSubdomainExcludeDocument>,
  ) {}
}
