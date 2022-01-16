<template>
  <q-select :options="complements" v-model="complementSelected" label="Complementos" clearable></q-select>
  <div class="text-right q-mt-md">
    <q-btn flat color="primary" @click="addComplement">Agregar al pedido</q-btn>
  </div>
</template>

<script>
import ComplementsService from 'src/services/complements.service'
import { onMounted, ref } from 'vue'

export default {
  emits: ['onAddComplement'],
  setup(props, { emit }) {
    onMounted(() => {
      fetchComplements()
    })

    const complements = ref([])
    const complementSelected = ref(null)
    async function fetchComplements() {
      const resp = await ComplementsService.fetchAll()
      complements.value = resp.map((d) => ({ ...d, value: d.id, label: d.name }))
    }
    function addComplement() {
      if (complementSelected.value != null) {
        emit('onAddComplement', complementSelected.value)
      }
    }

    return { complements, complementSelected, addComplement }
  },
}
</script>

<style></style>
