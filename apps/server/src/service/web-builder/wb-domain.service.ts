import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WbDomain,
  WbDomainDocument,
} from 'src/schema/web-builder/wb-domain.schema';

@Injectable()
export class WbDomainService {
  constructor(
    @InjectModel(WbDomain.name)
    private readonly wbDomainModel: Model<WbDomainDocument>,
  ) {}

  getAll() {
    return this.wbDomainModel.find({});
  }
}
