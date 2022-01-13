import ClientService from 'src/services/clients.service'
export default {
  namespaced: true,
  state: {
    clients: [],
  },
  mutations: {
    SET_CLIENTS(state, clients) {
      state.clients = clients
    },
    DELETE_CLIENT(state, client) {
      state.clients = state.clients.filter((c) => c.id != client.id)
    },
    UPDATE_CLIENT(state, client) {
      state.clients = state.clients.map((c) => (c.id == client.id ? client : c))
    },
    ADD_CLIENT(state, client) {
      state.clients.push(client)
    },
  },
  actions: {
    async fetchClients({ state, commit }) {
      try {
        const clients = await ClientService.fetchAll()
        commit('SET_CLIENTS', clients)
      } catch (error) {
        console.log(error)
      }
    },
  },
  getters: {
    //
  },
}
