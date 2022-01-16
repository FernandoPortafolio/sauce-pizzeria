<template>
  <Table :columns="columns" :rows="orderTypes" rowKey="id" :filter="filter" :loading="loading" title="Tipos de Masa">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>
</template>

<script>
import OrderTypeService from 'src/services/order_types.service'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import Table from 'src/components/Table.vue'

export default {
  components: { Table },
  setup() {
    const $q = useQuasar()
    const orderTypes = ref([])
    const filter = ref('')
    const loading = ref(false)
    const numberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

    const columns = [
      {
        name: 'name',
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'price',
        label: 'Precio',
        align: 'left',
        field: (row) => `${numberFormat.format(row.price)}`,
        sortable: true,
      },
    ]

    onMounted(async () => {
      fetchOrderTypes()
    })

    async function fetchOrderTypes() {
      loading.value = true
      orderTypes.value = await OrderTypeService.fetchAll()
      loading.value = false
    }

    function showEditDialog(orderType) {
      console.log(orderType)
    }

    function deteleOrderType(orderType) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar ${orderType.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          console.log(orderType)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return { orderTypes, columns, showEditDialog, deteleOrderType, filter, loading }
  },
}
</script>

<style></style>
