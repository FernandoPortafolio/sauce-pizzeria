import { api } from 'boot/axios'
class MassService {
  async fetchAll() {
    try {
      const resp = await api.get('/mass_types')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/mass_types/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async create({ name, description }) {
    try {
      const resp = await api.post('/mass_types', { name, description })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { name, description }) {
    try {
      const resp = await api.put(`/mass_types/${id}`, { name, description })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/mass_types/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new MassService()
