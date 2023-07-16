import { InjectModel } from '@nestjs/mongoose';
import { J2ContainerService } from './j2-container.service';
import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { JOB_NAME_DOCKER } from 'src/constants/job.constant';
import { Game, GameDocument } from 'src/schema/game.schema';
import {
  InvoiceCloud,
  InvoiceCloudDocument,
} from 'src/schema/invoice-cloud.schema';
import { Plan, PlanDocument } from 'src/schema/plan.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { JobCreateContainer } from 'src/dtos/job.dto';

@Processor(JOB_NAME_DOCKER)
export class QueueDockerProcessor {
  constructor(
    private readonly j2ContainerService: J2ContainerService,
    @InjectModel(InvoiceCloud.name)
    private readonly invoiceCloudModel: Model<InvoiceCloudDocument>,
    @InjectModel(Game.name)
    private readonly gameModel: Model<GameDocument>,
    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  @Process()
  async transcode(job: Job<JobCreateContainer>) {
    const data = job.data;
    const plan = await this.planModel.findById(data.planId);
    if (!plan) {
      throw 'plan not found';
    }

    const game = await this.gameModel.findById(data.gameId);
    if (!game) {
      throw 'game not found';
    }

    const user = await this.userModel.findById(data.userId);
    if (!user) {
      throw 'user not found';
    }

    const invoiceCloud = await this.invoiceCloudModel.findById(
      data.invoiceCloudId,
    );
    if (!invoiceCloud) {
      throw 'invoice not found';
    }

    invoiceCloud.status = 'creating';
    await this.invoiceCloudModel.bulkSave([invoiceCloud]);

    return await this.j2ContainerService.newContainer(user, game, plan, (val) =>
      job.progress(val),
    );
  }

  @OnQueueCompleted()
  async handleComplete(job: Job<JobCreateContainer>) {
    const data = job.data;
    const invoiceCloud = await this.invoiceCloudModel.findById(
      data.invoiceCloudId,
    );
    if (!invoiceCloud) {
      throw 'invoice not found';
    }

    invoiceCloud.status = 'created';
    await this.invoiceCloudModel.bulkSave([invoiceCloud]);
  }

  @OnQueueFailed()
  async handleFailed(job: Job<JobCreateContainer>) {
    const data = job.data;
    const invoiceCloud = await this.invoiceCloudModel.findById(
      data.invoiceCloudId,
    );
    if (!invoiceCloud) {
      throw 'invoice not found';
    }

    invoiceCloud.status = 'error';
    await this.invoiceCloudModel.bulkSave([invoiceCloud]);

    const user = await this.userModel.findById(data.userId);
    if (!user) {
      throw 'user not found';
    }
    user.balance = (user.balance || 0) + (invoiceCloud.money || 0);
    await this.userModel.bulkSave([user]);
  }
}
