import { api } from 'boot/axios'
class EspecialtiesService {
  async fetchAll() {
    try {
      const resp = await api.get('/especialties')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/especialties/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async create({ name, description }) {
    try {
      const resp = await api.post('/especialties', { name, description })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { name, description }) {
    try {
      const resp = await api.put(`/especialties/${id}`, { name, description })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/especialties/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new EspecialtiesService()
