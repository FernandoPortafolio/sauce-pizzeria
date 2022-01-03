import { api } from 'boot/axios'

class AuthService {
  async login(user) {
    try {
      const resp = await api.post('/login', user)
      api.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }

  async logout() {
    try {
      const resp = await api.get('/logout')
      api.defaults.headers.common['Authorization'] = null
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }

  async getCurrentUser() {
    try {
      const resp = await api.get('/user')
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }

  async fetchRoles() {
    try {
      const resp = await api.get('/roles')
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }
}

export default new AuthService()
