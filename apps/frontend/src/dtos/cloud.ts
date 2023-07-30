export class CloudDto {
  name: string;
  _id: string;
  forwardIp: string;
  forwardPort: number;
  password: string
}

export class CloudCreateRequest {
  name: string;
  gameId: string;
  planId: string;
}