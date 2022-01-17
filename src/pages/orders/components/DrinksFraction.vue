<template>
  <q-select
    :options="filteredDrinks"
    @filter="filterDrinks"
    v-model="drinkSelected"
    label="Bebidas"
    use-input
    clearable
  ></q-select>
  <div class="text-right q-mt-md">
    <q-btn flat color="primary" @click="addDrink">Agregar al pedido</q-btn>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'

import DrinksService from 'src/services/drinks.service'

export default {
  setup() {
    onMounted(() => {
      fetchDrinks()
    })

    const drinks = ref([])
    const filteredDrinks = ref([])
    const orderDrinks = inject('orderDrinks')
    const drinkSelected = ref(null)
    async function fetchDrinks() {
      const resp = await DrinksService.fetchAll()
      drinks.value = resp.map((d) => ({ ...d, value: d.id, label: d.name }))
    }
    const filterDrinks = (val, update) => {
      if (val === '') return update(() => (filteredDrinks.value = drinks.value))

      const needle = val.toLowerCase()
      update(() => {
        filteredDrinks.value = drinks.value.filter((d) => d.name.toLowerCase().indexOf(needle) > -1)
      })
    }
    function addDrink() {
      if (drinkSelected.value != null) {
        // emit('onAddDrink', drinkSelected.value)
        const exists = orderDrinks.value.find((d) => d.id == drinkSelected.value.id)
        if (!exists) return orderDrinks.value.push({ quantity: 1, ...drinkSelected.value })

        orderDrinks.value = orderDrinks.value.map((d) => {
          if (d.id == drinkSelected.value.id) d.quantity++
          return d
        })
      }
    }

    return {
      filteredDrinks,
      drinkSelected,
      filterDrinks,
      addDrink,
    }
  },
}
</script>

<style></style>
