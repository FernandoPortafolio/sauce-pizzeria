<template>
  <q-page padding>
    <q-card class="my-card q-mb-lg">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title> Administración de Pedidos </q-toolbar-title>
          <q-btn class="q-mr-sm" flat dense round icon="add" @click="showCreateDialog = true" />
        </q-toolbar>
      </q-card-section>
    </q-card>

    <DialogCreateOrder :show="showCreateDialog" @onClose="showCreateDialog = false"></DialogCreateOrder>
  </q-page>
</template>

<script>
import DialogCreateOrder from './components/DialogCreateOrder.vue'
import { ref } from 'vue'

export default {
  components: {
    DialogCreateOrder,
  },
  setup() {
    const showCreateDialog = ref(false)

    return { showCreateDialog }
  },
}
</script>
