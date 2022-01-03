import { boot } from 'quasar/wrappers'

export default boot(async ({ app, router, store }) => {
  router.beforeEach((to, from, next) => {
    const isLoggedIn = store.state.auth.user != null

    if (!isLoggedIn && to.path != '/login') return next('/login')

    if (isLoggedIn && to.path == '/login') return next('/')

    return next()
  })
})
