import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WbWebsite, WbWebsiteDocument } from 'src/schema/wb-website.schema';

@Injectable()
export class WbWebsiteService {
  constructor(
    @InjectModel(WbWebsite.name)
    private WbWebsiteModel: Model<WbWebsiteDocument>,
  ) {}
}
