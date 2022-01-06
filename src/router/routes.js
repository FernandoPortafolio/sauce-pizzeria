const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') },
      { path: '/clientes', component: () => import('pages/clients/Clients.vue') },
      { path: '/ordenes', component: () => import('pages/orders/Orders.vue') },
      { path: '/usuarios', component: () => import('pages/users/Users.vue') },
      { path: '/settings', component: () => import('pages/settings/Settings.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
