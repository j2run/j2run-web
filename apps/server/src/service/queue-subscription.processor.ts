import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  JOB_NAME_SUBSCRIPTION,
  JOB_NAME_SUBSCRIPTION_HANDLE,
  JOB_NAME_SUBSCRIPTION_SYNC,
} from 'src/constants/job.constant';
import { DockerContainerService } from './docker-container.service';
import { JobSubscriptionCreate } from 'src/dtos/subscription.dto';

@Processor(JOB_NAME_SUBSCRIPTION)
export class QueueSubscriptionProcessor {
  constructor(
    private readonly dockerContainerService: DockerContainerService,
  ) {}

  @Process({ name: '*', concurrency: 1 })
  async transcode(job: Job<JobSubscriptionCreate>) {
    switch (job.name) {
      case JOB_NAME_SUBSCRIPTION_SYNC:
        await this.dockerContainerService.findAndRemoveExpiredContainer();
        break;

      case JOB_NAME_SUBSCRIPTION_HANDLE:
        await this.dockerContainerService.checkExpiredContainer(
          job.data.dockerContainerId,
        );
        break;
    }
  }
}
