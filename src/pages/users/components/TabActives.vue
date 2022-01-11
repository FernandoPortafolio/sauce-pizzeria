<template>
  <Table :columns="columns" :rows="users" rowKey="id" :filter="filter" :loading="loading" title="Usuarios Activos">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
          <q-btn flat dense round icon="delete_outline" @click="deleteUser(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>

  <DialogUpdateUser
    :show="showUpdateDialog"
    @onClose="showUpdateDialog = false"
    @onUpdate="editUser"
    :user="selectedUser"
  ></DialogUpdateUser>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import Table from 'src/components/Table.vue'

import DialogUpdateUser from 'src/pages/users/components/DialogUpdateUser.vue'
import UserService from 'src/services/users.service'

export default {
  components: { DialogUpdateUser, Table },
  props: {
    users: { required: true },
    loading: { default: false },
  },
  emits: ['onDelete', 'onUpdate'],
  setup(props, { emit }) {
    const filter = ref('')
    const $q = useQuasar()
    const showUpdateDialog = ref(false)
    const selectedUser = ref({})

    const columns = [
      {
        name: 'name',
        label: 'Nombre',
        align: 'left',
        field: (row) => `${row.name} ${row.last_name}`,
        sortable: true,
      },
      {
        name: 'email',
        label: 'Email',
        field: 'email',
        align: 'left',
        sortable: true,
      },
      {
        name: 'role',
        label: 'Rol',
        align: 'left',
        field: (row) => {
          const roles = row.roles.map((r) => r.name)
          return roles.join(', ')
        },
        sortable: true,
      },
    ]

    function deleteUser(user) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar a ${user.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await UserService.deleteUser(user.id)
          emit('onDelete', user)
        } catch (error) {
          console.log(error)
        }
      })
    }

    async function editUser(user) {
      if (!user.password) {
        user.password = undefined
        user.password_confirmation = undefined
      }
      try {
        console.log(user)
        const updateUser = await UserService.updateUser(user.id, user)
        emit('onUpdate', updateUser)
      } catch (error) {
        console.log(error)
      }
    }

    function showEditDialog(user) {
      selectedUser.value = user
      showUpdateDialog.value = true
    }

    return { columns, filter, deleteUser, showEditDialog, showUpdateDialog, selectedUser, editUser }
  },
}
</script>

<style></style>
