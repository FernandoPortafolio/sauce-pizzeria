import { api } from 'boot/axios'
class ComplementsService {
  async fetchAll() {
    try {
      const resp = await api.get('/complements')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/complements/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async create({ name, description, price }) {
    try {
      const resp = await api.post('/complements', { name, description, price })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { name, description, price }) {
    try {
      const resp = await api.put(`/complements/${id}`, { name, description, price })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/complements/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new ComplementsService()
