import { api } from 'boot/axios'
class SpecialtiesService {
  async fetchAll() {
    try {
      const resp = await api.get('/specialties')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/specialties/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async create({ name, description }) {
    try {
      const resp = await api.post('/specialties', { name, description })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { name, description }) {
    try {
      const resp = await api.put(`/specialties/${id}`, { name, description })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/specialties/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new SpecialtiesService()
