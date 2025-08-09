import { lazy } from 'react';

export const routes = [
  { path: '/', component: lazy(() => import('./features/items/List')) },
  { path: '/auth', component: lazy(() => import('./features/auth/Login')) },
  { path: '/register', component: lazy(() => import('./features/auth/Register')) },
  { path: '/settings', component: lazy(() => import('./features/settings/Index')) },
];
