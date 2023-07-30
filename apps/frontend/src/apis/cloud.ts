import { CloudCreateRequest, CloudDto } from "../dtos/cloud"
import { axiosInstance } from "./axios"

export const cloudService = {
  create: (data: CloudCreateRequest) => {
    return axiosInstance.post('cloud/create', data);
  },
  getAll: () => {
    return axiosInstance.get<CloudDto[]>('cloud/list')
      .then((rs) => rs.data);
  },
}