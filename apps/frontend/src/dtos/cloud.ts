export type CloudStage =
  | 'created'
  | 'restarting'
  | 'running'
  | 'removing'
  | 'paused'
  | 'exited'
  | 'dead';

export class CloudDto {
  _id: string;
  name: string;
  planId: string;
  gameId: string;
  password: string;
  expirationDate: string;
  isAutoRenew: boolean;
  createdAt: string;
  deleteAt: string;
  forwardIp: string;
  forwardPort: number;
  stage: CloudStage;
  status: string;
}

export class CloudCreateRequest {
  name: string;
  gameId: string;
  planId: string;
}