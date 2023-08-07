import axios from "axios"
import { LoginResponseDto } from "../dtos/auth";

const endpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:8010/' : '/api/';

export const authService = {
  login: (email: string, password: string) => {
    return axios.post<LoginResponseDto>(endpoint + 'auth/login', {
      email,
      password
    }).then((rs) => rs.data);
  },
  register: (email: string, password: string) => {
    return axios.post<LoginResponseDto>(endpoint + 'auth/register', {
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