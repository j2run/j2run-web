import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import {
  JOB_NAME_SUBSCRIPTION,
  JOB_NAME_SUBSCRIPTION_HANDLE,
  JOB_NAME_SUBSCRIPTION_SYNC,
} from 'src/constants/job.constant';
import { JobSubscriptionCreate } from 'src/dtos/subscription.dto';

@Injectable()
export class QueueSubscriptionService {
  private logger = new Logger('QueueSubscriptionService');

  constructor(
    @InjectQueue(JOB_NAME_SUBSCRIPTION)
    private readonly subscriptionQueue: Queue<JobSubscriptionCreate>,
  ) {
    this.addSyncJob();
  }

  async addSyncJob() {
    const cron = '*/30 * * * *'; // 30 min
    await this.subscriptionQueue.removeRepeatable(JOB_NAME_SUBSCRIPTION_SYNC, {
      cron,
    });

    return await this.subscriptionQueue.add(JOB_NAME_SUBSCRIPTION_SYNC, null, {
      repeat: { cron },
      removeOnComplete: true,
    });
  }

  async addSubscription(dto: JobSubscriptionCreate) {
    const job = await this.subscriptionQueue.add(
      JOB_NAME_SUBSCRIPTION_HANDLE,
      dto,
      {
        delay: (dto.usageSecond + 2) * 1000,
      },
    );
    this.logger.warn(`add subscription: ${job.id}`);
    return job;
  }
}
