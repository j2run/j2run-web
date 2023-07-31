import { InvoiceCloudDto, InvoiceCloudSearchRequest, InvoiceCloudViewedRequest } from "../dtos/invoice-cloud";
import { axiosInstance } from "./axios"

export const invoiceCloudService = {
  search: (dto: InvoiceCloudSearchRequest) => {
    return axiosInstance.post<InvoiceCloudDto[]>('invoice-cloud/search', dto)
      .then((rs) => rs.data);
  },
  viewed: (dto: InvoiceCloudViewedRequest) => {
    return axiosInstance.post<any[]>('invoice-cloud/viewed', dto)
      .then((rs) => rs.data);
  },
}