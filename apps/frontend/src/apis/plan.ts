import { PlanDto } from "../dtos/plan"
import { axiosInstance } from "./axios"

export const planService = {
  getAll: () => {
    return axiosInstance.get<PlanDto[]>('plan/list')
      .then((rs) => rs.data);
  }
}