import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JobDockerStatus } from 'src/dtos/job.dto';
import {
  DockerAction,
  DockerActionDocument,
} from 'src/schema/docker-action.schema';
import { UserDocument } from 'src/schema/user.schema';

@Injectable()
export class DockerActionService {
  constructor(
    @InjectModel(DockerAction.name)
    private dockerActionModel: Model<DockerActionDocument>,
  ) {}

  list(user: UserDocument) {
    return this.dockerActionModel.find({
      userId: new Types.ObjectId(user._id),
      $or: [
        {
          jobDockerStatus: JobDockerStatus.Waitting,
        },
        {
          jobDockerStatus: JobDockerStatus.Active,
        },
      ],
    });
  }
}
