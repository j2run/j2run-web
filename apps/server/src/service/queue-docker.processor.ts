import { InjectModel } from '@nestjs/mongoose';
import { J2ContainerService } from './j2-container.service';
import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Model, Types } from 'mongoose';
import {
  JOB_NAME_DOCKER,
  JOB_NAME_DOCKER_SYNC,
} from 'src/constants/job.constant';
import { Game, GameDocument } from 'src/schema/game.schema';
import {
  InvoiceCloud,
  InvoiceCloudDocument,
} from 'src/schema/invoice-cloud.schema';
import { Plan, PlanDocument } from 'src/schema/plan.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import {
  JobActionContainer,
  JobCreateContainer,
  JobDocker,
  JobDockerStatus,
  JobDockerType,
} from 'src/dtos/job.dto';
import { DockerContainer } from 'src/schema/docker-container.schema';
import {
  DockerAction,
  DockerActionDocument,
} from 'src/schema/docker-action.schema';
import {
  MSG_ACCOUNT_ILEGAL,
  MSG_GAME_ILEGAL,
  MSG_INVOICE_ILEGAL,
  MSG_PLAN_ILEGAL,
} from 'src/constants/message.constant';

type J2ContainerServiceMethods = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof J2ContainerService]: J2ContainerService[K] extends Function
    ? K
    : never;
}[keyof J2ContainerService];

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
    @InjectModel(DockerContainer.name)
    private readonly dockerContainerModel: Model<DockerContainer>,
    @InjectModel(DockerAction.name)
    private readonly dockerActionModel: Model<DockerActionDocument>,
  ) {}

  @Process({ name: '*', concurrency: 1 })
  async transcode(job: Job<any>) {
    switch (job.name) {
      case JOB_NAME_DOCKER_SYNC:
        return await this.transcodeSync();
      default:
        return this.transcodeDefault(job);
    }
  }

  async transcodeSync() {
    await this.j2ContainerService.sync();
  }

  async transcodeDefault(job: Job<JobDocker<any>>) {
    const data = job.data;
    switch (data.type) {
      case JobDockerType.CreateContainer:
        return await this.createContainerProcess(job);
      case JobDockerType.Start:
        return await this.actionContainerProcess(job, 'startContainer');
      case JobDockerType.Stop:
        return await this.actionContainerProcess(job, 'stopContainer');
      case JobDockerType.Restart:
        return await this.actionContainerProcess(job, 'restartContainer');
      case JobDockerType.RestartGame:
        return await this.actionContainerProcess(job, 'restartGameContainer');
      case JobDockerType.Remove:
        return await this.actionContainerProcess(job, 'removeContainer');
      case JobDockerType.Reset:
        return await this.actionContainerProcess(job, 'resetContainer');
    }
  }

  @OnQueueCompleted()
  async handleComplete(job: Job<JobDocker<any>>) {
    const data = job.data;
    switch (data.type) {
      case JobDockerType.CreateContainer:
        return await this.createContainerComplete(job);

      case JobDockerType.Start:
      case JobDockerType.Stop:
      case JobDockerType.Restart:
      case JobDockerType.RestartGame:
      case JobDockerType.Remove:
      case JobDockerType.Reset:
        return await this.actionContainerEnd(job, JobDockerStatus.Completed);
    }
  }

  @OnQueueFailed()
  async handleFailed(job: Job<JobDocker<any>>) {
    const data = job.data;
    switch (data.type) {
      case JobDockerType.CreateContainer:
        return await this.createContainerFailed(job);

      case JobDockerType.Start:
      case JobDockerType.Stop:
      case JobDockerType.Restart:
      case JobDockerType.RestartGame:
      case JobDockerType.Remove:
      case JobDockerType.Reset:
        return await this.actionContainerEnd(job, JobDockerStatus.Failed);
    }
  }

  private async createContainerProcess(
    job: Job<JobDocker<JobCreateContainer>>,
  ) {
    const data = job.data.data;
    const plan = await this.planModel.findById(data.planId);
    if (!plan) {
      return Promise.reject(new Error(MSG_PLAN_ILEGAL));
    }

    const game = await this.gameModel.findById(data.gameId);
    if (!game) {
      return Promise.reject(new Error(MSG_GAME_ILEGAL));
    }

    const user = await this.userModel.findById(data.userId);
    if (!user) {
      return Promise.reject(new Error(MSG_ACCOUNT_ILEGAL));
    }

    const invoiceCloud = await this.invoiceCloudModel.findById(
      data.invoiceCloudId,
    );
    if (!invoiceCloud) {
      return Promise.reject(new Error(MSG_INVOICE_ILEGAL));
    }

    invoiceCloud.status = 'creating';
    await this.invoiceCloudModel.bulkSave([invoiceCloud]);

    return await this.j2ContainerService.newContainer(
      data.name,
      user,
      game,
      plan,
      (val) => job.progress(val),
    );
  }

  private async createContainerComplete(
    job: Job<JobDocker<JobCreateContainer>>,
  ) {
    const data = job.data.data;
    const invoiceCloud = await this.invoiceCloudModel.findById(
      data.invoiceCloudId,
    );
    if (!invoiceCloud) {
      return Promise.reject(new Error(MSG_INVOICE_ILEGAL));
    }

    invoiceCloud.status = 'created';
    await this.invoiceCloudModel.bulkSave([invoiceCloud]);
  }

  private async createContainerFailed(job: Job<JobDocker<JobCreateContainer>>) {
    const data = job.data.data;
    const invoiceCloud = await this.invoiceCloudModel.findById(
      data.invoiceCloudId,
    );
    if (!invoiceCloud) {
      return Promise.reject(new Error(MSG_INVOICE_ILEGAL));
    }

    invoiceCloud.status = 'error';
    await this.invoiceCloudModel.bulkSave([invoiceCloud]);

    const user = await this.userModel.findById(data.userId);
    if (!user) {
      return Promise.reject(new Error('user not found'));
    }
    user.balance = (user.balance || 0) + (invoiceCloud.money || 0);
    await this.userModel.bulkSave([user]);
  }

  private async actionContainerProcess(
    job: Job<JobDocker<JobActionContainer>>,
    action: J2ContainerServiceMethods,
  ) {
    const data = job.data.data;
    const dockerContainer = await this.dockerContainerModel.findById(
      data.dockerContainerId,
    );
    if (!dockerContainer) {
      return Promise.reject(new Error('dockerContainer not found'));
    }
    job.progress(1);
    await this.actionContainerEnd(job, JobDockerStatus.Active);
    return await (this.j2ContainerService[action] as any)(
      dockerContainer,
      (val: number) => job.progress(val),
    );
  }

  private async actionContainerEnd(
    job: Job<JobDocker<JobActionContainer>>,
    status: JobDockerStatus,
  ) {
    const data = job.data.data;
    await this.dockerActionModel.updateOne(
      {
        _id: new Types.ObjectId(data.dockerActionId),
      },
      {
        $set: {
          jobDockerStatus: status,
        },
      },
    );
  }
}
