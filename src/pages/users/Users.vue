<template>
  <q-page padding>
    <q-card class="my-card q-mb-lg">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title> Administración de Usuarios </q-toolbar-title>
          <q-btn class="q-mr-sm" flat dense round icon="add" @click="showCreateDialog = true" />
        </q-toolbar>
      </q-card-section>

      <q-tabs v-model="tab" class="text-teal" align="left">
        <q-tab name="activos" label="Activos" />
        <q-tab name="inactivos" label="Inactivos" />
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="activos">
        <TabActives :users="users" :loading="loading" @onDelete="onDeleteUser" @onUpdate="onUpdateUser"></TabActives>
      </q-tab-panel>
      <q-tab-panel name="inactivos">
        <TabInactives :users="deletedUsers" :loading="loading" @onRestore="onRestoreUser"></TabInactives>
      </q-tab-panel>
    </q-tab-panels>

    <DialogCreateUser
      :show="showCreateDialog"
      @onClose="showCreateDialog = false"
      @onSave="onSaveUser"
    ></DialogCreateUser>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import TabActives from './components/TabActives.vue'
import TabInactives from './components/TabInactives.vue'
import DialogCreateUser from 'src/pages/users/components/DialogCreateUser.vue'

import UserService from 'src/services/users.service'

export default {
  components: {
    TabActives,
    TabInactives,
    DialogCreateUser,
  },
  setup() {
    const tab = ref('activos')
    const users = ref([])
    const deletedUsers = ref([])
    const loading = ref(false)
    const showCreateDialog = ref(false)

    onMounted(async () => {
      loading.value = true
      users.value = await UserService.fetchUsers()
      deletedUsers.value = await UserService.fetchDeletedUsers()
      console.log(users.value)
      loading.value = false
    })

    function onSaveUser(user) {
      users.value.push(user)
    }

    function onUpdateUser(user) {
      users.value = users.value.map((u) => (user.id === u.id ? user : u))
    }

    function onDeleteUser(user) {
      users.value = users.value.filter((u) => u.id != user.id)
      deletedUsers.value.push(user)
    }

    function onRestoreUser(user) {
      users.value.push(user)
      deletedUsers.value = deletedUsers.value.filter((u) => u.id != user.id)
    }

    return {
      tab,
      users,
      deletedUsers,
      loading,
      showCreateDialog,
      onSaveUser,
      onUpdateUser,
      onDeleteUser,
      onRestoreUser,
    }
  },
}
</script>
