import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DockerLabel,
  DockerLabelDocument,
} from 'src/schema/docker-label.schema';

@Injectable()
export class DockerLabelService {
  constructor(
    @InjectModel(DockerLabel.name)
    private dockerLabelModel: Model<DockerLabelDocument>,
  ) {
    // this.dockerLabelModel.create({
    //   name: 'NSO Plus',
    // });
  }
}
