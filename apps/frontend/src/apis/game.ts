import { GameDto } from "../dtos/game";
import { axiosInstance } from "./axios"

export const gameService = {
  getAll: () => {
    return axiosInstance.get<GameDto[]>('game/list')
      .then((rs) => rs.data);
  },
}