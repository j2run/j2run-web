export type InvoiceCloudStatus = 'waiting' | 'creating' | 'created' | 'error';

export class InvoiceCloudDto {
  _id: string;
  planId: string;
  gameId: string;
  userId: string;
  money: number;
  status: InvoiceCloudStatus;
  createdAt: string;
  updatedAt: string;
  isViewed: boolean;
}

export class InvoiceCloudSearchRequest {
  status: InvoiceCloudStatus[];
  notViewed?: boolean;
}

export class InvoiceCloudViewedRequest {
  invoiceCloudId: string;
}