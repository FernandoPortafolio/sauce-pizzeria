<template>
  <q-table
    title="Usuarios Eliminados"
    :rows="users"
    :columns="columns"
    :filter="filter"
    row-key="id"
    :loading="loading"
  >
    <template #top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template #header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
        <q-th><!-- Actions --></q-th>
      </q-tr>
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td :props="props" v-for="col in props.cols" :key="col.name">{{ col.value }}</q-td>
        <q-td style="width: 120px">
          <div class="text-center">
            <q-btn flat dense round icon="restore" @click="restoreUser(props.row)" />
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import UserService from 'src/services/users.service'

export default {
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
