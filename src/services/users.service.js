import { api } from 'boot/axios'

class UsersService {
  async registerUser({ name, last_name, email, password, password_confirmation, roles }) {
    try {
      const resp = await api.post('/users', {
        name,
        last_name,
        email,
        password,
        password_confirmation,
        roles,
      })
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }

  async updateUser(id, { name, last_name, email, password, password_confirmation, roles }) {
    try {
      const resp = await api.put(`/users/${id}`, {
        name,
        last_name,
        email,
        password,
        password_confirmation,
        roles,
      })
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }

  async deleteUser(id) {
    try {
      const resp = await api.delete(`/users/${id}`)
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }

  async fetchUsers() {
    try {
      const resp = await api.get('/users')
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }

  async fetchDeletedUsers() {
    try {
      const resp = await api.get('/users/deleted')
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }

  async restoreUser(id) {
    try {
      const resp = await api.get(`/users/restore/${id}`)
      return resp.data
    } catch (error) {
      throw error.response.data || error
    }
  }
}

export default new UsersService()
