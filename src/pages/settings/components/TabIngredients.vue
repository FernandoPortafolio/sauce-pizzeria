<template>
  <Table :columns="columns" :rows="ingredients" rowKey="id" :filter="filter" :loading="loading" title="Ingredientes">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
          <q-btn flat dense round icon="delete_outline" @click="deteleIngredient(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>
</template>

<script>
import IngredientsService from 'src/services/ingredients.service'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import Table from 'src/components/Table.vue'

export default {
  components: { Table },
  setup() {
    const $q = useQuasar()
    const ingredients = ref([])
    const filter = ref('')
    const loading = ref(false)

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
   
    ]

    onMounted(async () => {
      fetchIngredients()
    })

    async function fetchIngredients() {
      loading.value = true
      ingredients.value = await IngredientsService.fetchAll()
      loading.value = false
    }

    function showEditDialog(ingredient) {
      console.log(ingredient)
    }

    function deteleIngredient(ingredient) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar ${ingredient.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          console.log(ingredient)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return { ingredients, columns, showEditDialog, deteleIngredient, filter, loading }
  },
}
</script>

<style></style>
