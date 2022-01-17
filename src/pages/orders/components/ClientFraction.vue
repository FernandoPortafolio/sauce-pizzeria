<template>
  <div class="text-right">
    <q-btn flat dense @click="showCreateClient = true">Agregar Cliente</q-btn>
  </div>
  <div class="row items-center">
    <div class="col">
      <q-select
        label="Cliente"
        v-model="selectedClient"
        :options="filteredClients"
        @filter="filterClients"
        use-input
        clearable
      />
    </div>
    <div class="col" v-if="selectedClient != null">
      <div class="row items-center q-pl-xl">
        <div class="row">
          <div class="text-bold q-mr-sm">Calle:</div>
          <div class="q-mr-md">
            {{ selectedClient.address.street }}
            <q-popup-edit
              v-model="selectedClient.address.street"
              auto-save
              v-slot="scope"
              @update:model-value="updateClient"
            >
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </div>
        </div>

        <div class="row">
          <div class="text-bold q-mr-sm">#</div>
          <div class="q-mr-lg">
            {{ selectedClient.address.number }}
            <q-popup-edit
              v-model="selectedClient.address.number"
              auto-save
              v-slot="scope"
              @update:model-value="updateClient"
            >
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </div>
        </div>

        <div class="row">
          <div class="text-bold q-mr-sm">Colonia:</div>
          <div>
            {{ selectedClient.address.colony }}
            <q-popup-edit
              v-model="selectedClient.address.colony"
              auto-save
              v-slot="scope"
              @update:model-value="updateClient"
            >
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </div>
        </div>
      </div>
    </div>
  </div>

  <DialogCreateClient
    :show="showCreateClient"
    @onClose="showCreateClient = false"
    @onSave="selectClient"
  ></DialogCreateClient>
</template>

<script>
import { watch, ref, computed, onMounted, inject } from 'vue'
import { useStore } from 'vuex'

import DialogCreateClient from 'src/components/DialogCreateClient.vue'

export default {
  components: { DialogCreateClient },
  setup(props, { emit }) {
    const store = useStore()
    const showCreateClient = ref(false)

    onMounted(() => {
      store.dispatch('clients/fetchClients')
    })

    const selectedClient = inject('selectedClient')
    const clients = computed(() =>
      store.state.clients.clients.map((c) => ({
        ...c,
        label: `${c.first_name} ${c.last_name}`,
        value: c.id,
      }))
    )
    const filteredClients = ref([])
    const filterClients = (val, update) => {
      if (val === '') return update(() => (filteredClients.value = clients.value))

      const needle = val.toLowerCase()
      update(() => {
        filteredClients.value = clients.value.filter((c) => c.label.toLowerCase().indexOf(needle) > -1)
      })
    }
    function updateClient(client, init) {
      const update = { id: selectedClient.value.id, ...selectedClient.value.address }
      store.dispatch('clients/updateClient', update)
    }
    function selectClient(c) {
      selectedClient.value = { ...c, label: `${c.first_name} ${c.last_name}`, value: c.id }
    }

    return { selectedClient, filteredClients, filterClients, updateClient, showCreateClient, selectClient }
  },
}
</script>

<style></style>
