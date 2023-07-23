export class JobCreateContainer {
  gameId: string;
  planId: string;
  userId: string;
  invoiceCloudId: string;
}

export class JobActionContainer {
  dockerContainerId: string;
  dockerActionId: string;
  userId: string;
}

export enum JobDockerType {
  CreateContainer,
  Start,
  Stop,
  Restart,
  Remove,
  CronSync,
}

export enum JobDockerStatus {
  Waitting,
  Active,
  Completed,
  Failed,
}

export class JobDocker<T> {
  data: T;
  type: JobDockerType;
}
