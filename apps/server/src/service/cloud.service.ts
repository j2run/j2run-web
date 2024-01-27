import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CloudActionRequest,
  CloudCreateRequest,
  GetCloudLogRequest,
} from 'src/dtos/cloud.dto';
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
import { JobDockerStatus, JobDockerType } from 'src/dtos/job.dto';
import {
  DockerAction,
  DockerActionDocument,
} from 'src/schema/docker-action.schema';
import { DownloadService } from './download.service';
import {
  MSG_ACCOUNT_NOT_SUFFICENT_FUNDS,
  MSG_ACTION_ILEGAL,
  MSG_CONTAINER_NOT_EXISTS,
  MSG_CONTAINER_REMOVED,
  MSG_CONTAINER_REMOVING,
} from 'src/constants/message.constant';

@Injectable()
export class CloudService {
  logger = new Logger('CloudService');

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
    @InjectModel(DockerAction.name)
    private readonly dockerActionModel: Model<DockerActionDocument>,
    private readonly queueDockerService: QueueDockerService,
    private readonly downloadService: DownloadService,
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
        '_id planId gameId name connectionUrl status stage expirationDate password isAutoRenew createdAt deleteAt',
      )
      .sort({
        createdAt: 'desc',
      })
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
      throw new BadRequestException(MSG_ACCOUNT_NOT_SUFFICENT_FUNDS);
    }

    // change money
    user.balance = (user.balance || 0) - plan.money;
    await this.userModel.bulkSave([user]);

    // add invoice
    const invoice = await this.invoiceCloudModel.create({
      planId: new Types.ObjectId(dto.planId),
      gameId: new Types.ObjectId(dto.gameId),
      userId: new Types.ObjectId(user._id),
      money: plan.money,
      status: 'waiting',
    });

    // add job
    await this.queueDockerService.createContainer(
      dto.name,
      plan,
      game,
      invoice,
      user,
    );

    return true;
  }

  async action(
    action: JobDockerType,
    dto: CloudActionRequest,
    user: UserDocument,
  ) {
    const userId_ = new Types.ObjectId(user._id);
    const dockerContainerId_ = new Types.ObjectId(dto.dockerContainerId);

    const container = await this.dockerContainerModel.findById({
      _id: dockerContainerId_,
    });
    if (!container) {
      throw new NotFoundException(MSG_CONTAINER_NOT_EXISTS);
    }
    if (container.userId.toString() != user._id.toString()) {
      throw new ForbiddenException();
    }
    if (container.deleteAt) {
      throw new ForbiddenException(MSG_CONTAINER_REMOVED);
    }

    const actionCurrent = await this.dockerActionModel.findOne({
      userId: userId_,
      dockerContainerId: dockerContainerId_,
      $or: [
        {
          jobDockerStatus: JobDockerStatus.Waitting,
        },
        {
          jobDockerStatus: JobDockerStatus.Active,
        },
      ],
    });
    if (actionCurrent) {
      throw new ConflictException(MSG_ACTION_ILEGAL);
    }

    if (container.stage === 'removing') {
      throw new ConflictException(MSG_CONTAINER_REMOVING);
    }

    return await this.queueDockerService.actionContainer(
      action,
      dto.dockerContainerId,
      user._id,
    );
  }

  async createLinkLog(dto: GetCloudLogRequest, user: UserDocument) {
    const dockerContainerId_ = new Types.ObjectId(dto.dockerContainerId);
    const container = await this.dockerContainerModel.findById({
      _id: dockerContainerId_,
    });
    if (!container) {
      throw new NotFoundException(MSG_CONTAINER_NOT_EXISTS);
    }
    if (container.userId.toString() != user._id.toString()) {
      throw new ForbiddenException();
    }
    if (container.deleteAt) {
      throw new ForbiddenException(MSG_CONTAINER_REMOVED);
    }
    return this.downloadService.createLinkCloudLog(dto.dockerContainerId);
  }
}
