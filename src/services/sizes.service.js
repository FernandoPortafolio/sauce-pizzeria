import { api } from 'boot/axios'
class SizesService {
  async fetchAll() {
    try {
      const resp = await api.get('/sizes')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/sizes/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async create({ name, description, price }) {
    try {
      const resp = await api.post('/sizes', { name, description, price })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { name, description, price }) {
    try {
      const resp = await api.put(`/sizes/${id}`, { name, description, price })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/sizes/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new SizesService()
