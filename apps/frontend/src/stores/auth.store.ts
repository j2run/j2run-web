import { defineStore } from 'pinia';
import { authService } from '../apis/auth';
import { clearToken, setAccessToken, setRefreshToken } from '../apis/axios';
import { router } from '../router';

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') as string)
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: getUser(),
    }),
    actions: {
        async login(email: string, password: string) {
          const rs = await authService.login(email, password);
          localStorage.setItem('user', JSON.stringify(rs.user));
          setAccessToken(rs.accessToken);
          setRefreshToken(rs.refreshToken);
          this.user = rs.user;
          router.push('/manage');
        },
        logout() {
          this.user = null;
          localStorage.removeItem('user');
          clearToken();
          router.push('/login');
        }
    }
});