import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlanHashmap } from 'src/dtos/plan.dto';
import { Plan, PlanDocument } from 'src/schema/plan.schema';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,
  ) {}

  getAllView() {
    return this.planModel
      .find({})
      .select('_id name cpu ram fps description updatedAt')
      .exec();
  }

  async allHashmap() {
    const plans = await this.planModel.find({});
    return plans.reduce((val, item) => {
      val[item._id.toString()] = item;
      return val;
    }, {} as PlanHashmap);
  }
}
