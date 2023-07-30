import { CloudCreateRequest } from "../dtos/cloud"
import { axiosInstance } from "./axios"

export const cloudService = {
  create: (data: CloudCreateRequest) => {
    return axiosInstance.post('cloud/create', data);
  }
}