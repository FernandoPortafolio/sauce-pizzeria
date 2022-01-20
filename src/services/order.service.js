import { api } from 'boot/axios'

class OrderService {
  async fetchPaymentTypes() {
    try {
      const resp = await api.get('/payment_types')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchAll() {
    try {
      const resp = await api.get('/orders')
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async fetchOne(id) {
    try {
      const resp = await api.get(`/orders/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async createOrder(order) {
    try {
      const resp = await api.post('/orders', order)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  async deleteOrder(id) {
    try {
      const resp = await api.delete(`/orders/${id}`)
      return resp.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default new OrderService()
