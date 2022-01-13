import { api } from 'boot/axios'
class ClientsService {
  async fetchAll() {
    try {
      const resp = await api.get('/clients')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/clients/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async create({ first_name, last_name, phone, street, colony, number }) {
    try {
      const resp = await api.post('/clients', { first_name, last_name, phone, street, colony, number })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { first_name, last_name, phone, street, colony, number }) {
    try {
      const resp = await api.put(`/clients/${id}`, { first_name, last_name, phone, street, colony, number })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/clients/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new ClientsService()
