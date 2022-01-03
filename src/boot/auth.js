import { boot } from 'quasar/wrappers'

export default boot(async ({ app, router, store }) => {
  router.beforeEach((to, from, next) => {
    const isLoggedIn = store.state.auth.user != null
    console.log(store.state.auth.user)

    if (!isLoggedIn && to.path != '/login') return next('/login')

    return next()
  })
})
