import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Model, Types } from 'mongoose';
import {
  JOB_NAME_DOCKER,
  JOB_NAME_DOCKER_SYNC,
} from 'src/constants/job.constant';
import {
  JobActionContainer,
  JobCreateContainer,
  JobDocker,
  JobDockerStatus,
  JobDockerType,
} from 'src/dtos/job.dto';
import {
  DockerAction,
  DockerActionDocument,
} from 'src/schema/docker-action.schema';
import { GameDocument } from 'src/schema/game.schema';
import { InvoiceCloudDocument } from 'src/schema/invoice-cloud.schema';
import { PlanDocument } from 'src/schema/plan.schema';
import { UserDocument } from 'src/schema/user.schema';

@Injectable()
export class QueueDockerService {
  logger = new Logger('QueueDockerService');

  constructor(
    @InjectQueue(JOB_NAME_DOCKER)
    private readonly dockerQueue: Queue<
      JobDocker<JobCreateContainer | JobActionContainer>
    >,
    @InjectModel(DockerAction.name)
    private readonly dockerActionModel: Model<DockerActionDocument>,
  ) {
    this.addSyncJob();
  }

  async addSyncJob() {
    const cron = '*/30 * * * * *';
    await this.dockerQueue.removeRepeatable(JOB_NAME_DOCKER_SYNC, {
      cron,
    });

    return await this.dockerQueue.add(JOB_NAME_DOCKER_SYNC, null, {
      repeat: { cron },
      removeOnComplete: true,
    });
  }

  createContainer(
    plan: PlanDocument,
    game: GameDocument,
    invoice: InvoiceCloudDocument,
    user: UserDocument,
  ) {
    return this.dockerQueue.add({
      type: JobDockerType.CreateContainer,
      data: {
        planId: plan._id.toString(),
        gameId: game._id.toString(),
        invoiceCloudId: invoice._id.toString(),
        userId: user._id.toString(),
      },
    });
  }

  async actionContainer(
    action: JobDockerType,
    dockerContainerId: string,
    userId: string,
  ) {
    const resultAction = await this.dockerActionModel.create({
      userId: new Types.ObjectId(userId),
      dockerContainerId: new Types.ObjectId(dockerContainerId),
      jobDockerStatus: JobDockerStatus.Waitting,
      jobDockerType: action,
    });
    const result = await this.dockerQueue
      .add({
        type: action,
        data: {
          dockerActionId: resultAction._id,
          dockerContainerId,
          userId,
        } as JobActionContainer,
      })
      .catch((e) => {
        this.logger.error(e);
        return Promise.resolve(null);
      });
    if (!result) {
      await this.dockerActionModel.deleteMany([resultAction]);
    }
    return result;
  }
}
