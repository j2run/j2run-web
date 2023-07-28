import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from './stores/auth.store';

const routes: Readonly<RouteRecordRaw[]> = [
  { path: '/', component: import('./pages/Home.vue') },
  { path: '/login', component: import('./pages/Login.vue') },
  { 
    path: '/manage',
    meta: { auth: true },
    children: [
      {
        path: '',
        component: import('./pages/Cloud.vue'),
      },
      {
        path: 'create',
        component: import('./pages/Cloud.vue'),
      },
      {
        path: 'detail/:id',
        component: import('./pages/Cloud.vue'),
      },
    ]
  },
  { 
    path: '/remote/:id',
    component: import('./pages/Remote.vue'),
  },
  { 
    path: '/remote-dock',
    meta: { auth: true },
    component: import('./pages/Remote.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _, next) => {
  const auth = useAuthStore();
  if (to.meta.auth && !auth.user) {
    auth.returnUrl = to.fullPath;
    next('/login');
  } else if (auth.user && !to.meta.auth) {
    next('/manage');
  } else {
    next();
  }
});