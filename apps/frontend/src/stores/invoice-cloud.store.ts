import { defineStore } from 'pinia';
import { InvoiceCloudDto } from '../dtos/invoice-cloud';
import { invoiceCloudService } from '../apis/invoice-cloud';
import { list2map } from '../utils/common';

export const useInvoiceCloudStore = defineStore({
    id: 'invoice-cloud',
    state: () => ({
      doing: [] as InvoiceCloudDto[],
      doingMap: {} as SMap<InvoiceCloudDto>,
      error: [] as InvoiceCloudDto[],
      errorMap: {} as SMap<InvoiceCloudDto>,
    }),
    actions: {
      async loadAll() {
        this.doing = await invoiceCloudService.search({
          status: ['waiting', 'creating'],
        });
        this.doingMap = list2map(this.doing, '_id');

        this.error = await invoiceCloudService.search({
          status: ['error'],
          notViewed: true
        });
        this.errorMap = list2map(this.error, '_id');
      },
    }
});