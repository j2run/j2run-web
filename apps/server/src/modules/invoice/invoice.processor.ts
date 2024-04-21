import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_INVOICE } from 'src/utils/constants/queue.constant';
import { InvoiceService } from './invoice.service';
import { JobInvoicePay } from 'src/dtos/job.dto';
import { InvoiceLogService } from '../invoice-log/invoice-log.service';
import { InvoiceLogStatus } from 'src/schema/invoice-log.entity';
import { InvoiceStatus } from 'src/schema/invoice.entity';

@Processor(QUEUE_INVOICE)
export class InvoiceConsumer {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoiceLogService: InvoiceLogService,
  ) {}

  @Process({ concurrency: 1 })
  transcode(job: Job<JobInvoicePay>) {
    return this.invoiceService.payProcess(job.data);
  }

  @OnQueueFailed()
  async failedHandler(job: Job<JobInvoicePay>, err: Error) {
    const invoiceId = job.data.invoiceId;
    await this.invoiceLogService.addLog(
      InvoiceLogStatus.error,
      err.message,
      invoiceId,
    );
    await this.invoiceService.changeStatusInvoice(
      invoiceId,
      err.name === 'MSG_WB_SUBDOMAIN_EXISTS'
        ? InvoiceStatus.void
        : InvoiceStatus.open,
    );
  }
}
