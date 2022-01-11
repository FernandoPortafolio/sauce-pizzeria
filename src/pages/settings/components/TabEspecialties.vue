<template>
  <Table :columns="columns" :rows="especialties" rowKey="id" :filter="filter" :loading="loading" title="Especialidades">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
          <q-btn flat dense round icon="delete_outline" @click="deteleEspecialty(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>
</template>

<script>
import EspecialtiesService from 'src/services/especialties.service'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import Table from 'src/components/Table.vue'

export default {
  components: { Table },
  setup() {
    const $q = useQuasar()
    const especialties = ref([])
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
      fetchEspecialties()
    })

    async function fetchEspecialties() {
      loading.value = true
      especialties.value = await EspecialtiesService.fetchAll()
      loading.value = false
    }

    function showEditDialog(especialty) {
      console.log(especialty)
    }

    function deteleEspecialty(especialty) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar ${especialty.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          console.log(especialty)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return { especialties, columns, showEditDialog, deteleEspecialty, filter, loading }
  },
}
</script>

<style></style>
