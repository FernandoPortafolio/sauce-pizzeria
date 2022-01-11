import { api } from 'boot/axios'
class DrinksService {
  async fetchAll() {
    try {
      const resp = await api.get('/drinks')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/drinks/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async create({ name, description, price }) {
    try {
      const resp = await api.post('/drinks', { name, description, price })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { name, description, price }) {
    try {
      const resp = await api.put(`/drinks/${id}`, { name, description, price })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/drinks/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new DrinksService()
