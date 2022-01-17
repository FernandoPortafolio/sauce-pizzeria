<template>
  <q-select :options="complements" v-model="complementSelected" label="Complementos" clearable></q-select>
  <div class="text-right q-mt-md">
    <q-btn flat color="primary" @click="addComplement">Agregar al pedido</q-btn>
  </div>
</template>

<script>
import ComplementsService from 'src/services/complements.service'
import { onMounted, ref, inject } from 'vue'

export default {
  setup() {
    onMounted(() => {
      fetchComplements()
    })

    const complements = ref([])
    const complementSelected = ref(null)
    const orderComplements = inject('orderComplements')
    
    async function fetchComplements() {
      const resp = await ComplementsService.fetchAll()
      complements.value = resp.map((d) => ({ ...d, value: d.id, label: d.name }))
    }
    function addComplement() {
      if (complementSelected.value != null) {
        const exists = orderComplements.value.find((d) => d.id == complementSelected.value.id)
        if (!exists) return orderComplements.value.push({ quantity: 1, ...complementSelected.value })

        orderComplements.value = orderComplements.value.map((d) => {
          if (d.id == complementSelected.value.id) d.quantity++
          return d
        })
      }
    }

    return { complements, complementSelected, addComplement }
  },
}
</script>

<style></style>
