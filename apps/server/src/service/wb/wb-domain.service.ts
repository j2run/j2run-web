import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WbDomain, WbDomainDocument } from 'src/schema/wb-domain.schema';

@Injectable()
export class WbDomainService {
  constructor(
    @InjectModel(WbDomain.name)
    private WbDomainModel: Model<WbDomainDocument>,
  ) {}
}
