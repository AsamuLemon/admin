import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'login' && !sessionStorage.getItem('token')) {
//     next({
//       name: 'login',
//     })
//   } else {
//     next()
//   }
// })

export default router
