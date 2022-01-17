<template>
  <fieldset class="q-mt-md q-mb-md">
    <legend>Tipo de Pedido</legend>
    <q-select :options="orderTypes" v-model="orderType" label="Tipo de Pedido"></q-select>
  </fieldset>

  <q-input v-model="observations" type="textarea" label="Observaciones" outlined />
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import OrderTypeService from 'src/services/order_types.service'

export default {
  setup() {
    onMounted(() => {
      fetchOrderTypes()
    })

    //tipos de reparto
    const orderTypes = ref([])
    const orderType = inject('orderType')
    const observations = inject('observations')

    async function fetchOrderTypes() {
      const resp = await OrderTypeService.fetchAll()
      orderTypes.value = resp.map((r) => ({ ...r, value: r.id, label: r.name }))
    }

    return { orderTypes, orderType, observations }
  },
}
</script>

<style></style>
