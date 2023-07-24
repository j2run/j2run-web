import { defineStore } from 'pinia';
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
        returnUrl: null as string | null
    }),
    actions: {
        async login(username: string, password: string) {
            const user = { username, password };
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            router.push(this.returnUrl || '/');
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/login');
        }
    }
});