import { api } from 'boot/axios'
class OrderTypesService {
  async fetchAll() {
    try {
      const resp = await api.get('/order_types')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/order_types/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async update(id, { name, price }) {
    try {
      const resp = await api.put(`/order_types/${id}`, { name, price })
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async delete(id) {
    try {
      const resp = await api.delete(`/order_types/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new OrderTypesService()
