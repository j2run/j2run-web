import { CloudActionDto } from "../dtos/cloud-action";
import { axiosInstance } from "./axios"

export const cloudActionService = {
  list: () => {
    return axiosInstance.get<CloudActionDto[]>('cloud-action/list')
      .then((rs) => rs.data);
  },
}