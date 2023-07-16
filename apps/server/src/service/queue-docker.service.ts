import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { JOB_NAME_DOCKER } from 'src/constants/job.constant';
import { JobCreateContainer } from 'src/dtos/job.dto';
import { GameDocument } from 'src/schema/game.schema';
import { InvoiceCloudDocument } from 'src/schema/invoice-cloud.schema';
import { PlanDocument } from 'src/schema/plan.schema';
import { UserDocument } from 'src/schema/user.schema';

@Injectable()
export class QueueDockerService {
  constructor(
    @InjectQueue(JOB_NAME_DOCKER)
    private readonly dockerQueue: Queue<JobCreateContainer>,
  ) {}

  createContainer(
    plan: PlanDocument,
    game: GameDocument,
    invoice: InvoiceCloudDocument,
    user: UserDocument,
  ) {
    return this.dockerQueue.add({
      planId: plan._id.toString(),
      gameId: game._id.toString(),
      invoiceCloudId: invoice._id.toString(),
      userId: user._id.toString(),
    });
  }
}
