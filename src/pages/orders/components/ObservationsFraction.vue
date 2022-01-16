<template>
  <!-- Tipo de Pedido -->
  <fieldset class="q-mt-md q-mb-md">
    <legend>Tipo de Pedido</legend>
    <q-select :options="orderTypes" v-model="orderType" label="Tipo de Pedido"></q-select>
  </fieldset>
  <!-- FIN Tipo de Pedido -->

  <q-input v-model="observations" type="textarea" label="Observaciones" outlined />
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import OrderTypeService from 'src/services/order_types.service'

export default {
  emits: ['onChangeOrderType', 'onChangeObservations'],
  setup(props, { emit }) {
    onMounted(() => {
      fetchOrderTypes()
    })

    //tipos de reparto
    const orderTypes = ref([])
    const orderType = ref(null)
    const observations = ref(null)

    async function fetchOrderTypes() {
      const resp = await OrderTypeService.fetchAll()
      orderTypes.value = resp.map((r) => ({ ...r, value: r.id, label: r.name }))
    }

    watch(
      () => orderType.value,
      () => {
        emit('onChangeOrderType', orderType.value)
      }
    )

    watch(
      () => observations.value,
      () => {
        emit('onChangeObservations', observations.value)
      }
    )

    return { orderTypes, orderType, observations }
  },
}
</script>

<style></style>
