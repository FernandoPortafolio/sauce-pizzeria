<template>
  <Table :columns="columns" :rows="specialties" rowKey="id" :filter="filter" :loading="loading" title="Especialidades">
    <template #actions="props">
      <q-td style="width: 120px">
        <div class="text-center">
          <q-btn flat dense round icon="edit" class="q-mr-sm" @click="showEditDialog(props.row)" />
          <q-btn flat dense round icon="delete_outline" @click="deteleSpecialty(props.row)" />
        </div>
      </q-td>
    </template>
  </Table>
</template>

<script>
import SpecialtiesService from 'src/services/specialties.service'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import Table from 'src/components/Table.vue'

export default {
  components: { Table },
  setup() {
    const $q = useQuasar()
    const specialties = ref([])
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
      fetchSpecialties()
    })

    async function fetchSpecialties() {
      loading.value = true
      specialties.value = await SpecialtiesService.fetchAll()
      loading.value = false
    }

    function showEditDialog(specialty) {
      console.log(specialty)
    }

    function deteleSpecialty(specialty) {
      $q.dialog({
        title: 'Confirmación',
        message: `¿Estas seguro de eliminar ${specialty.name}?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          console.log(specialty)
        } catch (error) {
          console.log(error)
        }
      })
    }

    return { specialties, columns, showEditDialog, deteleSpecialty, filter, loading }
  },
}
</script>

<style></style>
