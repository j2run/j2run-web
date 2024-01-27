import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';
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
import { benchmarkRuntime } from 'src/utils/time';
import { QueueDockerService } from './queue-docker.service';
import { QueueSubscriptionService } from './queue-subscription.service';
import { JobDockerType } from 'src/dtos/job.dto';
import {
  MSG_CONTAINER_CANNOT_STOP,
  MSG_CONTAINER_HANDLING,
  MSG_CONTAINER_NOT_EXISTS,
  MSG_CONTAINER_NOT_EXPIRED,
} from 'src/constants/message.constant';
import { format } from 'src/utils/common';

@Injectable()
export class DockerContainerService {
  logger = new Logger('DockerContainerService');

  constructor(
    @InjectModel(DockerContainer.name)
    private dockerContainerModel: Model<DockerContainerDocument>,
    @InjectModel(InvoiceCloud.name)
    private readonly invoiceCloudModel: Model<InvoiceCloudDocument>,
    @InjectModel(Game.name)
    private readonly gameModel: Model<GameDocument>,
    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly queueDockerService: QueueDockerService,
    private readonly queueSubscriptionService: QueueSubscriptionService,
  ) {}

  async findAndRemoveExpiredContainer() {
    const bmr = benchmarkRuntime('findAndRemoveExpiredContainer');
    const containers = await this.dockerContainerModel.find({
      expirationDate: {
        $lt: new Date(),
      },
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
    });
    this.logger.warn(`${containers.length} ${MSG_CONTAINER_CANNOT_STOP}`);
    for (const container of containers) {
      await this.checkExpiredContainerObject(container);
    }
    bmr();
  }

  async checkExpiredContainer(dockerContainerId: string) {
    const container = await this.dockerContainerModel.findOne({
      _id: new Types.ObjectId(dockerContainerId),
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
    });
    if (!container) {
      throw new Error(MSG_CONTAINER_NOT_EXISTS);
    }
    return await this.checkExpiredContainerObject(container);
  }

  private async checkExpiredContainerObject(
    dockerContainer: DockerContainerDocument,
  ) {
    this.logger.warn(`check subscription: ${dockerContainer.id}`);
    if (moment().isBefore(dockerContainer.expirationDate)) {
      return Promise.reject(
        new Error(format(MSG_CONTAINER_NOT_EXPIRED, dockerContainer.id)),
      );
    }
    if (dockerContainer.expirationHandleTime) {
      if (
        moment().add(5, 'minute').isAfter(dockerContainer.expirationHandleTime)
      ) {
        this.logger.warn(format(MSG_CONTAINER_HANDLING, dockerContainer.id));
        return false;
      }
    }

    let hasRenew = false;
    if (dockerContainer.isAutoRenew) {
      hasRenew = await this.renewContainer(dockerContainer);
    }

    if (!hasRenew) {
      dockerContainer.expirationHandleTime = new Date();
      await this.dockerContainerModel.bulkSave([dockerContainer]);
      await this.queueDockerService.actionContainer(
        JobDockerType.Remove,
        dockerContainer.id,
        dockerContainer.userId.toString(),
      );
    }
  }

  private async renewContainer(dockerContainer: DockerContainerDocument) {
    const plan = await this.planModel.findById(dockerContainer.planId);
    if (!plan) {
      return false;
    }

    const game = await this.gameModel.findById(dockerContainer.gameId);
    if (!game) {
      return false;
    }

    const user = await this.userModel.findById(dockerContainer.userId);
    if (!user) {
      return false;
    }

    if (plan.money > (user.balance || 0)) {
      return false;
    }

    // change money
    this.logger.warn(
      `user ${user._id} change balance ${user.balance} by ${plan.money}`,
    );
    user.balance = (user.balance || 0) - plan.money;
    await this.userModel.bulkSave([user]);

    // add invoice
    await this.invoiceCloudModel.create({
      planId: new Types.ObjectId(plan._id),
      gameId: new Types.ObjectId(game._id),
      money: plan.money,
      status: 'created',
    });
    this.logger.warn(`user ${user._id} add invoice`);

    // change container
    const usageSecond = plan.usageSecond;
    const expirationDate = moment().add(usageSecond, 'second').toDate();
    dockerContainer.expirationDate = expirationDate;
    this.logger.warn(`docker container ${dockerContainer._id} update expired`);

    // add subscription
    const subscriptionJob = await this.queueSubscriptionService.addSubscription(
      {
        dockerContainerId: dockerContainer._id,
        userId: user._id,
        usageSecond,
        expirationDate,
      },
    );
    dockerContainer.expirationJobId = subscriptionJob.id.toString();
    dockerContainer.expirationHandleTime = null;
    this.logger.warn(
      `docker container ${dockerContainer._id} add subscription`,
    );
    await this.dockerContainerModel.bulkSave([dockerContainer]);
    return true;
  }
}
