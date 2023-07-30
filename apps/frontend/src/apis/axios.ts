import axios from 'axios';

const REFRESH_TOKEN = 'refresh_token';
const ACCESS_TOKEN = 'access_token';


function refreshToken () {
  return axiosInstance.post('auth/access',{
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
  axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
  localStorage.setItem(ACCESS_TOKEN, accessToken)
}

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8010/',
  headers: {
    'Content-Type': 'application/json',
  }
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    config.headers.set('Authorization', 'Bearer ' + accessToken);
  }
  return config;
})

axiosInstance.interceptors.response.use((response) => {
  const { code } = response.data;
  if (code === 40) {
    return refreshToken().then(rs => {
        console.log('get token refresh:', rs.data)
        const { accessToken } = rs.data;
        setAccessToken(accessToken);
        const config = response.config;
        return axiosInstance(config);
    })
  }
  return response;
}, (error) => {
  console.warn('Error status', error.response.status)
  return Promise.reject(error)
})