export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
  },
  mutations: {
    LOGIN(state, payload) {
      state.user = payload.user
      state.token = payload.token
    },
    LOGOUT(state) {
      state.user = null
      localStorage.removeItem('vuex')
    },
  },
  actions: {
    //
  },
  getters: {
    //
  },
}
