<template>
  <Table :columns="columns" :rows="drinks" rowKey="id" :filter="filter" :loading="loading" title="Bebidas">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
          <q-btn flat dense round icon="delete_outline" @click="deteleDrink(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>
</template>

<script>
import DrinksService from 'src/services/drinks.service'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import Table from 'src/components/Table.vue'

export default {
  components: { Table },
  setup() {
    const $q = useQuasar()
    const drinks = ref([])
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
        field: (row) => `${numberFormat.format(row.price)}`,
        sortable: true,
      },
    ]

    onMounted(async () => {
      fetchDrinks()
    })

    async function fetchDrinks() {
      loading.value = true
      drinks.value = await DrinksService.fetchAll()
      loading.value = false
    }

    function showEditDialog(drink) {
      console.log(drink)
    }

    function deteleDrink(drink) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar ${drink.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          console.log(drink)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return { drinks, columns, showEditDialog, deteleDrink, filter, loading }
  },
}
</script>

<style></style>
