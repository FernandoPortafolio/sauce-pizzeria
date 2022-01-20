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

    <Table :columns="columns" :rows="orders" rowKey="id" :filter="filter" :loading="loading" title="Órdenes">
      <template #actions="props">
        <q-td style="width: 120px">
          <div class="text-center">
            <q-btn flat dense round icon="delete_outline" @click="deteleOrder(props.row)" />
            <q-btn flat dense round icon="preview" @click="deteleOrder(props.row)" />
          </div>
        </q-td>
      </template>
    </Table>

    <DialogCreateOrder :show="showCreateDialog" @onClose="showCreateDialog = false"></DialogCreateOrder>
  </q-page>
</template>

<script>
import { ref, onMounted, provide } from 'vue'

import OrderService from 'src/services/order.service'

import DialogCreateOrder from './components/DialogCreateOrder.vue'
import Table from 'src/components/Table.vue'

export default {
  components: {
    DialogCreateOrder,
    Table,
  },
  setup() {
    const showCreateDialog = ref(false)
    const loading = ref(false)
    const orders = ref([])
    const filter = ref(null)
    provide('orders', orders)

    onMounted(() => {
      fetchOrders()
    })

    const columns = [
      {
        name: 'no_order',
        label: 'No. Orden',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'client',
        label: 'Cliente',
        align: 'left',
        field: (row) => `${row.client.first_name} ${row.client.last_name}`,
        sortable: true,
      },
      {
        name: 'hour',
        label: 'Hora',
        align: 'left',
        field: (row) => {
          const date = new Date(row.created_at)
          return date.toLocaleString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })
        },
        sortable: true,
      },
    ]

    async function fetchOrders() {
      loading.value = true
      orders.value = await OrderService.fetchAll()
      console.log(orders.value)
      loading.value = false
    }

    async function deteleOrder(order) {
      const date = new Date(order.created_at)
      console.log(
        date.toLocaleString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })
      )
    }

    return { showCreateDialog, orders, loading, columns, deteleOrder, filter }
  },
}
</script>
