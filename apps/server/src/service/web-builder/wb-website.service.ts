import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StatusResponse } from 'src/dtos/common.dto';
import { NewSubdomainValidRequest } from 'src/dtos/wb/wb-website.dto';
import {
  WbWebsite,
  WbWebsiteDocument,
} from 'src/schema/web-builder/wb-website.schema';
import { WbSubdomainExcludeService } from './wb-subdomain-exclude.service';
import { MSG_WB_SUBDOMAIN_BANNED, MSG_WB_SUBDOMAIN_EXISTS } from 'src/constants/message.constant';

@Injectable()
export class WbWebsiteService {
  constructor(
    @InjectModel(WbWebsite.name)
    private wbWebsiteModel: Model<WbWebsiteDocument>,
    private readonly wbSubDomainExcludeService: WbSubdomainExcludeService,
  ) {}

  async newSubdomainValid(
    search: NewSubdomainValidRequest,
  ): Promise<StatusResponse> {
    const isDomainExclude = await this.wbSubDomainExcludeService.isExclude(
      search.subdomain,
    );
    if (isDomainExclude) {
      throw new ForbiddenException(MSG_WB_SUBDOMAIN_BANNED);
    }

    const isWebsiteExisted = await this.wbWebsiteModel
      .find({
        wbDomainId: new Types.ObjectId(search.wbDomainId),
        subdomain: search.subdomain,
      })
      .then((result) => !!result && result.length > 0);

    if (isWebsiteExisted) {
      throw new ConflictException(MSG_WB_SUBDOMAIN_EXISTS);
    }

    return {
      status: true,
    };
  }
}
