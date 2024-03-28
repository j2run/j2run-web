import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_INVOICE } from 'src/utils/constants/queue.constant';
import { InvoiceService } from './invoice.service';
import { JobInvoicePay } from 'src/dtos/job.dto';

@Processor(QUEUE_INVOICE)
export class InvoiceConsumer {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Process({ concurrency: 1 })
  transcode(job: Job<JobInvoicePay>) {
    return this.invoiceService.payProcess(job.data);
  }
}
