import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import auth from './auth.store'

export default store(function () {
  const Store = createStore({
    modules: {
      auth,
    },
  })

  return Store
})
