import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Plan, PlanDocument } from 'src/schema/plan.schema';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,
  ) {
    // this.planModel.create({
    //   name: 'Cloud 1',
    //   dockerLabelIds: [
    //     new Types.ObjectId('64b2b8d5c5643969901cc8bc'),
    //     new Types.ObjectId('64b2b8d5c5643969901cc8b1'),
    //   ],
    //   image: 'nginx:alpine',
    //   cpu: 0.3,
    //   ram: 200,
    // });
  }
}
