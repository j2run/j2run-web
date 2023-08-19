import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from './stores/auth.store';

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '',
    component: () => import('./pages/Home.vue'),
    meta: { noAuth: true },
  },
  {
    path: '/login',
    component: () => import('./pages/Login.vue'),
    meta: { noAuth: true },
  },
  {
    path: '/register',
    component: () => import('./pages/Register.vue'),
    meta: { noAuth: true },
  },
  { 
    path: '/manage',
    meta: { auth: true },
    component: () => import('./components/layouts/Managelayout.vue'),
    children: [
      {
        path: '',
        component: () => import('./pages/Cloud.vue'),
      },
      {
        path: 'create',
        component: () => import('./pages/CreateCloud.vue'),
      },
      {
        path: 'invoice',
        component: () => import('./pages/Invoice.vue'),
      },
    ]
  },
  { 
    path: '/remote/:id',
    meta: { auth: true },
    component: () => import('./pages/Remote.vue'),
  },
  { 
    path: '/remote-dock',
    meta: { auth: true },
    component: () => import('./pages/Remote.vue'),
  },
  // { 
  //   path: '/remote-mobile',
  //   meta: { auth: true },
  //   component: () => import('./pages/RemoteMobile.vue'),
  // },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: { noAuth: true },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const auth = useAuthStore();
  if (to.meta.auth && !auth.user) {
    next('/login');
  } else if (auth.user && to.meta.noAuth) {
    next('/manage');
  } else {
    next();
  }
});