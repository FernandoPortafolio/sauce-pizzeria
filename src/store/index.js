import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './auth.store'
import clients from './clients.store'
import { api } from 'boot/axios'

export default store(function () {
  const Store = createStore({
    modules: {
      auth,
      clients,
    },
    plugins: [
      createPersistedState({
        rehydrated: (store) => {
          api.defaults.headers.common['Authorization'] = `Bearer ${store.state.auth.token}`
        },
      }),
    ],
  })

  return Store
})
