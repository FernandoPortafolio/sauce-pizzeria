<template>
  <Table :columns="columns" :rows="users" rowKey="id" :filter="filter" :loading="loading" title="Usuarios Eliminados">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="restore" class="q-mr-sm" @click="restoreUser(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import Table from 'src/components/Table.vue'

import UserService from 'src/services/users.service'

export default {
  components: { Table },
  props: {
    users: { required: true },
    loading: { default: false },
  },
  emits: ['onRestore'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const filter = ref('')
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

    function restoreUser(user) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar a ${user.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await UserService.restoreUser(user.id)
          emit('onRestore', user)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return { restoreUser, columns, filter }
  },
}
</script>

<style></style>
