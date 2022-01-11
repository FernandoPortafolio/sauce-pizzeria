<template>
  <Table :columns="columns" :rows="massTypes" rowKey="id" :filter="filter" :loading="loading" title="Tipos de Masa">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
          <q-btn flat dense round icon="delete_outline" @click="deteleMassType(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>
</template>

<script>
import MassTypeService from 'src/services/mass.service'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import Table from 'src/components/Table.vue'

export default {
  components: { Table },
  setup() {
    const $q = useQuasar()
    const massTypes = ref([])
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
      fetchMassTypes()
    })

    async function fetchMassTypes() {
      loading.value = true
      massTypes.value = await MassTypeService.fetchAll()
      loading.value = false
    }

    function showEditDialog(massType) {
      console.log(massType)
    }

    function deteleMassType(massType) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar ${massType.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          console.log(massType)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return { massTypes, columns, showEditDialog, deteleMassType, filter, loading }
  },
}
</script>

<style></style>
