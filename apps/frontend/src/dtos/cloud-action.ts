export enum CloudActionType {
  CreateContainer,
  Start,
  Stop,
  Restart,
  RestartGame,
  Remove,
  CronSync,
  Reset
}

export enum CloudActionStatus {
  Waitting,
  Active,
  Completed,
  Failed,
}

export class CloudActionDto {
  _id: string;
  userId: string;
  dockerContainerId: string;
  jobDockerType: CloudActionType;
  jobDockerStatus: CloudActionStatus;
  createdAt: string;
  updatedAt: string;
}