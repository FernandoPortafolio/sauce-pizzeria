import AuthService from 'services/auth.service'

export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
    roles: [],
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
    SET_ROLES(state, roles) {
      state.roles = roles
    },
  },
  actions: {
    async fetchRoles({ state, commit }) {
      try {
        const roles = await AuthService.fetchRoles()
        commit('SET_ROLES', roles)
      } catch (error) {
        console.log(error)
      }
    },
  },
  getters: {
    isAdmin: (state) => {
      return state.user.roles.some((r) => r.id == 1)
    },
  },
}
