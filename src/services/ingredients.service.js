import { api } from 'boot/axios'
class IngredientsService {
  async fetchAll() {
    try {
      const resp = await api.get('/ingredients')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/ingredients/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async create({ name, description }) {
    try {
      const resp = await api.post('/ingredients', { name, description })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { name, description }) {
    try {
      const resp = await api.put(`/ingredients/${id}`, { name, description })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/ingredients/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new IngredientsService()
