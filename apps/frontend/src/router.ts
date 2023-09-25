import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from './stores/auth.store';
import { usePageStore } from './stores/app.store';

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
    path: '/forgot-password',
    component: () => import('./pages/ForgotPassword.vue'),
    meta: { noAuth: true },
  },
  {
    path: '/forgot-password/:id',
    component: () => import('./pages/ForgotPassword.vue'),
    meta: { noAuth: true },
  },
  {
    path: '/reset-password',
    component: () => import('./pages/ResetPassword.vue'),
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
        path: 'cloud',
        component: () => import('./pages/Cloud.vue'),
      },
      {
        path: 'cloud/create',
        component: () => import('./pages/CreateCloud.vue'),
      },
      {
        path: 'payment',
        component: () => import('./pages/Payment.vue'),
      },
      {
        path: 'profile',
        component: () => import('./pages/Profile.vue'),
      },
      {
        path: '',
        redirect: '/manage/cloud',
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
  {
    path: '/trial',
    component: () => import('./pages/CloudTrial.vue'),
  },
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

router.beforeEach(async (to, prev, next) => {
  const pageStore = usePageStore();
  let showPageLoading = true;
  if (prev && prev.path == to.path) {
    showPageLoading = false;
  }
  if (showPageLoading) {
    pageStore.showPageLoading();
  }

  const auth = useAuthStore();
  if (to.meta.auth && !auth.user) {
    next('/login');
  } else if (auth.user && to.meta.noAuth) {
    next('/manage');
  } else {
    next();
  }
});

router.afterEach(async (_to, _, _fail) => {
  const pageStore = usePageStore();
  pageStore.hidePageLoading();
})