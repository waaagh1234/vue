import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/mall',
    name: 'Mall',
    component: () => import('../views/Mall.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/product-detail/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/search-results',
    name: 'SearchResults',
    component: () => import('../views/SearchResults.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue')
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('../views/Records.vue')
  },
  {
    path: '/my-reviews',
    name: 'MyReviews',
    component: () => import('../views/MyReviews.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue')
  },
  {
    path: '/merchant-login',
    name: 'MerchantLogin',
    component: () => import('../views/MerchantLogin.vue')
  },
  {
    path: '/merchant-dashboard',
    name: 'MerchantDashboard',
    component: () => import('../views/MerchantDashboard.vue')
  },
  {
    path: '/merchant-orders',
    name: 'MerchantOrders',
    component: () => import('../views/MerchantOrders.vue')
  },
  {
    path: '/merchant-statistics',
    name: 'MerchantStatistics',
    component: () => import('../views/MerchantStatistics.vue')
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

