import axios from "axios"
import { LoginResponseDto } from "../dtos/auth";

const endpoint = 'http://localhost:8010/';

export const authService = {
  login: (email: string, password: string) => {
    return axios.post<LoginResponseDto>(endpoint + 'auth/login', {
      email,
      password
    }).then((rs) => rs.data);
  },
  verify: (code: string) => {
    return axios.post(endpoint + 'auth/verify', {
      code
    })
  },
}