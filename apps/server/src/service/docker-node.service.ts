import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DockerNode, DockerNodeDocument } from 'src/schema/docker-node.schema';

@Injectable()
export class DockerNodeService {
  constructor(
    @InjectModel(DockerNode.name)
    private dockerNodeModel: Model<DockerNodeDocument>,
  ) {}
}
