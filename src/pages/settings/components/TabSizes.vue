<template>
  <Table :columns="columns" :rows="sizes" rowKey="id" :filter="filter" :loading="loading" title="Tamaños">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
          <q-btn flat dense round icon="delete_outline" @click="deteleSize(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>
</template>

<script>
import SizesService from 'src/services/sizes.service'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import Table from 'src/components/Table.vue'

export default {
  components: { Table },
  setup() {
    const $q = useQuasar()
    const sizes = ref([])
    const filter = ref('')
    const loading = ref(false)
    const numberFormat = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'MXN' })

    const columns = [
      {
        name: 'name',
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'description',
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'price',
        label: 'Precio',
        align: 'left',
        field: (row) => `$${numberFormat.format(row.price)}`,
        sortable: true,
      },
    ]

    onMounted(async () => {
      fetchSizes()
    })

    async function fetchSizes() {
      loading.value = true
      sizes.value = await SizesService.fetchAll()
      loading.value = false
    }

    function showEditDialog(size) {
      console.log(size)
    }

    function deteleSize(size) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar ${size.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          console.log(size)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return { sizes, columns, showEditDialog, deteleSize, filter, loading }
  },
}
</script>

<style></style>
