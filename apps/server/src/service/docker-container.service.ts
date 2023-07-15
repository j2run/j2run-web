import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DockerContainer,
  DockerContainerDocument,
} from 'src/schema/docker-container.schema';

@Injectable()
export class DockerContainerService {
  constructor(
    @InjectModel(DockerContainer.name)
    private DockerContainerModel: Model<DockerContainerDocument>,
  ) {}
}
