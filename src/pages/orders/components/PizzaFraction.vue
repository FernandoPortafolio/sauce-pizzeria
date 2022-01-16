<template>
  <div class="row q-mb-md q-gutter-x-lg">
    <div class="col-2">
      <img
        :src="pizzaType == 1 ? '/img/completa-selected.png' : '/img/completa-unselected.png'"
        class="cursor-pointer"
        @click="changeType(1)"
      />
      <q-tooltip class="bg-primary text-white">Piza Completa</q-tooltip>
    </div>
    <div class="col-2">
      <img
        :src="pizzaType == 2 ? '/img/media-selected.png' : '/img/media-unselected.png'"
        class="cursor-pointer"
        @click="changeType(2)"
      />
      <q-tooltip class="bg-primary text-white">Piza Mitad y Mitad</q-tooltip>
    </div>
  </div>

  <div class="row items-center q-mb-md">
    <label class="col q-mr-md">Tamaño:</label>
    <div class="col" v-for="size in sizes" :key="size.id">
      <q-btn
        flat
        size="sm"
        @click="sizeSelected = size"
        :class="size.id == sizeSelected?.id ? 'bg-primary text-white' : ''"
      >
        {{ size.name }}
      </q-btn>
    </div>
  </div>

  <div class="row items-center" v-if="pizzaType == 1">
    <label class="q-mr-md">Especialidad:</label>
    <q-select :options="especialities" v-model="specialty1"> </q-select>
  </div>

  <div class="row items-center" v-if="pizzaType == 2">
    <div class="col-6 row items-center">
      <label class="q-mr-md">Especialidad 1:</label>
      <q-select :options="especialities" v-model="specialty1"> </q-select>
    </div>

    <div class="col-6 row items-center">
      <label class="q-mr-md">Especialidad 2:</label>
      <q-select :options="especialities" v-model="specialty2"> </q-select>
    </div>
  </div>

  <div class="row q-mt-md">
    <div class="col" v-if="specialty1?.name == 'Personalizada'">
      <q-checkbox
        v-for="ingredient in ingredients"
        :label="ingredient.name"
        :key="ingredient.id"
        :val="ingredient"
        v-model="ingredients1"
      />
    </div>
    <div class="col" v-if="specialty2?.name == 'Personalizada'">
      <q-checkbox
        v-for="ingredient in ingredients"
        :label="ingredient.name"
        :key="ingredient.id"
        :val="ingredient"
        v-model="ingredients2"
        color="teal"
      />
    </div>
  </div>
  <div class="text-right q-mt-md">
    <q-btn flat color="primary" @click="addPizza">Agregar al pedido</q-btn>
  </div>
</template>

<script>
import { watch, ref, onMounted } from 'vue'

import SizesService from 'src/services/sizes.service'
import SpecialtiesService from 'src/services/specialties.service'
import IngredientsService from 'src/services/ingredients.service'
import { useQuasar } from 'quasar'

export default {
  emits: ['onAddPizza'],
  setup(props, { emit }) {
    const $q = useQuasar()

    const sizes = ref([])
    const especialities = ref([])
    const ingredients = ref([])
    const pizzaType = ref(0)
    const sizeSelected = ref(null)
    const specialty1 = ref(null)
    const specialty2 = ref(null)
    const ingredients1 = ref([])
    const ingredients2 = ref([])
    const pizzas = ref([])

    onMounted(() => {
      fetchSizes()
      fetchSpecialties()
      fetchIngredients()
    })

    async function fetchSizes() {
      sizes.value = await SizesService.fetchAll()
    }
    async function fetchSpecialties() {
      const resp = await SpecialtiesService.fetchAll()
      especialities.value = resp.map((s) => ({ ...s, label: s.name, value: s.id }))
    }
    async function fetchIngredients() {
      ingredients.value = await IngredientsService.fetchAll()
    }
    function changeType(type) {
      pizzaType.value = type
      if (type == 1) {
        specialty2.value = null
        ingredients2.value = []
      }
    }
    watch([specialty1, specialty2], () => {
      if (specialty1.value?.name != 'Personalizada') ingredients1.value = []
      if (specialty2.value?.name != 'Personalizada') ingredients2.value = []
    })

    function resetPizza() {
      pizzaType.value = 0
      sizeSelected.value = null
      specialty1.value = null
      specialty2.value = null
      ingredients1.value = []
      ingredients2.value = []
    }
    function addPizza() {
      let message = null
      if (pizzaType.value == 0) message = 'Selecciona Pizza Completa o Mitad y Mitad'
      else if (sizeSelected.value == null) message = 'Selecciona un tamaño para la pizza'
      else if (pizzaType.value == 1) {
        if (specialty1.value == null) message = 'Selecciona una especialidad'
        else if (specialty1.value.name == 'Personalizada' && ingredients1.value.length == 0)
          message = 'Seleciona al menos un ingrediente'
      } else if (pizzaType.value == 2) {
        if (specialty1.value == null) message = 'Selecciona una especialidad para la mitad 1'
        else if (specialty1.value.name == 'Personalizada' && ingredients1.value.length == 0)
          message = 'Seleciona al menos un ingrediente para la mitad 1'
        else if (specialty2.value == null) message = 'Selecciona una especialidad para la mitad 2'
        else if (specialty2.value.name == 'Personalizada' && ingredients2.value.length == 0)
          message = 'Seleciona al menos un ingrediente para la mitad 2'
      }
      if (message != null) {
        $q.notify({
          message,
          color: 'negative',
          timeout: 1000,
        })
      } else {
        const ingredients = []
        ingredients1.value.forEach((i) => {
          ingredients.push({ id: i.id, name: i.name, half: 1 })
        })
        ingredients2.value.forEach((i) => {
          ingredients.push({ id: i.id, name: i.name, half: 2 })
        })
        const pizza = {
          size: sizeSelected.value,
          specialty1: specialty1.value,
          specialty2: specialty2.value,
          ingredients,
        }
        emit('onAddPizza', pizza)
        resetPizza()
      }
    }
    return {
      pizzaType,
      sizes,
      sizeSelected,
      specialty1,
      specialty2,
      especialities,
      ingredients,
      changeType,
      ingredients1,
      ingredients2,
      addPizza,
      pizzas,
    }
  },
}
</script>

<style></style>
