import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  JOB_NAME_DOCKER,
  JOB_NAME_DOCKER_SYNC,
} from 'src/constants/job.constant';
import {
  JobActionContainer,
  JobCreateContainer,
  JobDocker,
  JobDockerType,
} from 'src/dtos/job.dto';
import { GameDocument } from 'src/schema/game.schema';
import { InvoiceCloudDocument } from 'src/schema/invoice-cloud.schema';
import { PlanDocument } from 'src/schema/plan.schema';
import { UserDocument } from 'src/schema/user.schema';

@Injectable()
export class QueueDockerService {
  constructor(
    @InjectQueue(JOB_NAME_DOCKER)
    private readonly dockerQueue: Queue<
      JobDocker<JobCreateContainer | JobActionContainer>
    >,
  ) {
    this.addSyncJobIfNotExists();
  }

  async addSyncJobIfNotExists() {
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

  actionContainer(
    action: JobDockerType,
    dockerContainerId: string,
    userId: string,
  ) {
    return this.dockerQueue.add({
      type: action,
      data: {
        dockerContainerId,
        userId,
      } as JobActionContainer,
    });
  }
}
