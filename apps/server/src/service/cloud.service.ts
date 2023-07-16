import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudCreateRequest } from 'src/dtos/cloud.dto';
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
        deleteAt: {
          $exists: false,
        },
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
      planId: new Types.ObjectId(dto.gameId),
      gameId: new Types.ObjectId(dto.gameId),
      money: plan.money,
      status: 'waiting',
    });

    // add job
    await this.queueDockerService.createContainer(plan, game, invoice, user);

    return true;
  }
}
