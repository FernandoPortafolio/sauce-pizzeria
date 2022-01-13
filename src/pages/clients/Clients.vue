<template>
  <q-page padding>
    <q-card class="my-card q-mb-lg">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title> Administración de Clientes </q-toolbar-title>
          <q-btn class="q-mr-sm" flat dense round icon="add" @click="showCreateDialog = true" />
        </q-toolbar>
      </q-card-section>
    </q-card>

    <Table :columns="columns" :rows="clients" rowKey="id" :filter="filter" :loading="loading" title="Clientes">
      <template #actions="props">
        <q-td style="width: 120px">
          <div class="text-center">
            <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
            <q-btn flat dense round icon="delete_outline" @click="deteleClient(props.row)" />
          </div>
        </q-td>
      </template>
    </Table>

    <DialogCreateClient :show="showCreateDialog" @onClose="showCreateDialog = false"></DialogCreateClient>
    <DialogUpdateClient
      :show="showUpdateDialog"
      @onClose="showUpdateDialog = false"
      :client="selectedClient"
    ></DialogUpdateClient>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import Table from 'src/components/Table.vue'
import DialogCreateClient from './components/DialogCreateClient.vue'
import DialogUpdateClient from './components/DialogUpdateClient.vue'
import ClientService from 'src/services/clients.service'

export default {
  components: { Table, DialogCreateClient, DialogUpdateClient },
  setup() {
    const store = useStore()
    const $q = useQuasar()
    const filter = ref('')
    const loading = ref(false)
    const clients = computed(() => store.state.clients.clients)
    const showCreateDialog = ref(false)
    const showUpdateDialog = ref(false)
    const selectedClient = ref(null)

    const columns = [
      {
        name: 'name',
        label: 'Nombre',
        align: 'left',
        field: (row) => `${row.first_name} ${row.last_name}`,
        sortable: true,
      },
      {
        name: 'phone',
        label: 'Teléfono',
        field: 'phone',
        sortable: true,
      },
      {
        name: 'address',
        label: 'Dirección',
        field: (row) => `${row.address.street} #${row.address.number}. ${row.address.colony}`,
        sortable: true,
      },
    ]

    onMounted(() => {
      fetchClients()
    })

    async function fetchClients() {
      loading.value = true
      await store.dispatch('clients/fetchClients')
      loading.value = false
    }

    function deteleClient(client) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar a ${client.first_name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await ClientService.delete(client.id)
          store.commit('clients/DELETE_CLIENT', client)
          $q.notify({
            message: 'Cliente eliminado',
            color: 'dark',
          })
        } catch (error) {
          console.log(error)
        }
      })
    }

    function showEditDialog(client) {
      showUpdateDialog.value = true
      selectedClient.value = client
    }

    return {
      columns,
      clients,
      filter,
      loading,
      deteleClient,
      showCreateDialog,
      showUpdateDialog,
      selectedClient,
      showEditDialog,
    }
  },
}
</script>
