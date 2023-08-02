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
  delete: (id: string) => {
    return axiosInstance.post('cloud/remove',  {
      dockerContainerId: id,
    });
  },
  start: (id: string) => {
    return axiosInstance.post('cloud/start',  {
      dockerContainerId: id,
    });
  },
  stop: (id: string) => {
    return axiosInstance.post('cloud/stop',  {
      dockerContainerId: id,
    });
  },
  restart: (id: string) => {
    return axiosInstance.post('cloud/restart',  {
      dockerContainerId: id,
    });
  },
  restartGame: (id: string) => {
    return axiosInstance.post('cloud/restart-game',  {
      dockerContainerId: id,
    });
  },
}