import axios, { AxiosResponse } from 'axios';

const REFRESH_TOKEN = 'refresh_token';
const ACCESS_TOKEN = 'access_token';
const endpoint = '/api/';


function refreshToken () {
  return axios.post(endpoint + 'auth/access',{
    refreshToken: localStorage.getItem(REFRESH_TOKEN)
  })
}

export function clearToken () {
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ACCESS_TOKEN);
}

export function setRefreshToken(refreshToken: string) {
  localStorage.setItem(REFRESH_TOKEN, refreshToken)
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN, accessToken)
}

export const axiosInstance = axios.create({
  baseURL: endpoint,
  headers: {
    'Content-Type': 'application/json',
  }
})

axiosInstance.interceptors.request.use((config) => {
  if (config) {
    config.headers.set('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
  }
  return config;
})

axiosInstance.interceptors.response.use(
  (response: any) => {
    if (response.status === 401) {
      return handleUnauthorized(response, null);
    }
    return response;
  },
  (error: { config: any; response: AxiosResponse<any, any> }) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleUnauthorized(error.response, originalRequest);
    }
    return Promise.reject(error);
  }
);

function handleUnauthorized(response: AxiosResponse<any, any>, config: any) {
  return refreshToken()
    .then((rs) => {
      setAccessToken(rs.data.accessToken);
      return axiosInstance(config || response.config);
    })
    .catch((e) => {
      if (e.response.status === 401) {
        localStorage.removeItem('user');
        clearToken();
        location.href = '/';
      }
      return Promise.reject(e);
    })
}

if (localStorage.getItem(ACCESS_TOKEN)) {
  setAccessToken(localStorage.getItem(ACCESS_TOKEN) as string);
}