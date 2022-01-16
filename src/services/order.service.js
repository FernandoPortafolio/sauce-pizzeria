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
}

export default new OrderService()
