import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudActionRequest, CloudCreateRequest } from 'src/dtos/cloud.dto';
import {
  DockerContainer,
  DockerContainerDocument,
} from 'src/schema/docker-container.schema';
import { Game, GameDocument } from 'src/schema/game.schema';
import {
  InvoiceCloud,
  InvoiceCloudDocument,
} from 'src/schema/invoice-cloud.schema';
import { Plan, PlanDocument } from 'src/schema/plan.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { QueueDockerService } from './queue-docker.service';
import { JobDockerType } from 'src/dtos/job.dto';

@Injectable()
export class CloudService {
  constructor(
    @InjectModel(DockerContainer.name)
    private readonly dockerContainerModel: Model<DockerContainerDocument>,
    @InjectModel(InvoiceCloud.name)
    private readonly invoiceCloudModel: Model<InvoiceCloudDocument>,
    @InjectModel(Game.name)
    private readonly gameModel: Model<GameDocument>,
    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly queueDockerService: QueueDockerService,
  ) {}

  getAllView(user: UserDocument) {
    return this.dockerContainerModel
      .find({
        userId: new Types.ObjectId(user._id),
        $or: [
          {
            deleteAt: {
              $exists: false,
            },
          },
          {
            deleteAt: {
              $eq: null,
            },
          },
        ],
      })
      .select(
        '_id planId gameId forwardIp forwardPort status stage createdAt deleteAt',
      )
      .exec();
  }

  async create(dto: CloudCreateRequest, user: UserDocument) {
    const plan = await this.planModel.findById(dto.planId);
    if (!plan) {
      throw new NotFoundException();
    }

    const game = await this.gameModel.findById(dto.gameId);
    if (!game) {
      throw new NotFoundException();
    }

    if (plan.money > (user.balance || 0)) {
      throw new BadRequestException('not enough money');
    }

    // change money
    user.balance = (user.balance || 0) - plan.money;
    await this.userModel.bulkSave([user]);

    // add invoice
    const invoice = await this.invoiceCloudModel.create({
      planId: new Types.ObjectId(dto.planId),
      gameId: new Types.ObjectId(dto.gameId),
      money: plan.money,
      status: 'waiting',
    });

    // add job
    await this.queueDockerService.createContainer(plan, game, invoice, user);

    return true;
  }

  async action(
    action: JobDockerType,
    dto: CloudActionRequest,
    user: UserDocument,
  ) {
    const container = await this.dockerContainerModel.findById({
      _id: new Types.ObjectId(dto.dockerContainerId),
    });
    if (!container) {
      throw new NotFoundException('container not exists');
    }
    if (container.userId.toString() != user._id.toString()) {
      throw new ForbiddenException();
    }
    if (container.deleteAt) {
      throw new ForbiddenException('container removed');
    }

    if (container.stage === 'removing') {
      throw new ConflictException();
    }

    return await this.queueDockerService.actionContainer(
      action,
      dto.dockerContainerId,
      user._id,
    );
  }
}
