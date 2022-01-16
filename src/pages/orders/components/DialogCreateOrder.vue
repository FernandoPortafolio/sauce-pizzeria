<template>
  <q-dialog v-model="show" transition-show="slide-up" transition-hide="slide-down" persistent maximized>
    <q-card class="bg-white">
      <q-bar class="bg-primary">
        <q-space />

        <q-btn dense flat icon="close" color="white" @click="close">
          <q-tooltip class="bg-primary text-white">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <div class="row">
        <div class="col-12 col-md-6">
          <q-card-section>
            <!-- CLIENTE -->
            <fieldset>
              <legend>Cliente</legend>

              <div class="row items-center">
                <div class="col">
                  <q-select
                    label="Cliente"
                    v-model="selectedClient"
                    :options="filteredClients"
                    @filter="filterClients"
                    use-input
                    clearable
                  />
                </div>
                <div class="col" v-if="selectedClient != null">
                  <div class="row items-center q-pl-xl">
                    <div class="row">
                      <div class="text-bold q-mr-sm">Calle:</div>
                      <div class="q-mr-md">
                        {{ selectedClient.address.street }}
                        <q-popup-edit
                          v-model="selectedClient.address.street"
                          auto-save
                          v-slot="scope"
                          @update:model-value="updateClient"
                        >
                          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                      </div>
                    </div>

                    <div class="row">
                      <div class="text-bold q-mr-sm">#</div>
                      <div class="q-mr-lg">
                        {{ selectedClient.address.number }}
                        <q-popup-edit
                          v-model="selectedClient.address.number"
                          auto-save
                          v-slot="scope"
                          @update:model-value="updateClient"
                        >
                          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                      </div>
                    </div>

                    <div class="row">
                      <div class="text-bold q-mr-sm">Colonia:</div>
                      <div>
                        {{ selectedClient.address.colony }}
                        <q-popup-edit
                          v-model="selectedClient.address.colony"
                          auto-save
                          v-slot="scope"
                          @update:model-value="updateClient"
                        >
                          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                        </q-popup-edit>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <!-- FIN CLIENTE -->

            <!-- PIZZAS -->
            <fieldset class="q-mt-md">
              <legend>Pizzas</legend>

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
            </fieldset>
            <!-- FIN PIZZAS -->

            <!-- BEBIDAS -->
            <fieldset class="q-mt-md">
              <legend>Bebidas</legend>
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
            </fieldset>
            <!-- FIN BEBIDAS -->

            <!-- COMPLEMENTOS -->
            <fieldset class="q-mt-md">
              <legend>Complementos</legend>
              <q-select :options="complements" v-model="complementSelected" label="Complementos" clearable></q-select>
              <div class="text-right q-mt-md">
                <q-btn flat color="primary" @click="addComplement">Agregar al pedido</q-btn>
              </div>
            </fieldset>
            <!-- FIN COMPLEMENTOS -->

            <!-- Tipo de Pedido -->
            <fieldset class="q-mt-md q-mb-md">
              <legend>Tipo de Pedido</legend>
              <q-select :options="orderTypes" v-model="orderType" label="Tipo de Pedido"></q-select>
            </fieldset>
            <!-- FIN Tipo de Pedido -->

            <q-input v-model="observations" type="textarea" label="Observaciones" outlined />
          </q-card-section>
        </div>

        <div class="col-12 col-md-6">
          <q-card-section>
            <!-- TODO RESUMEN -->
            <p class="text-bold q-mt-sm">Resumen Del Pedido</p>
            <q-markup-table separator="none" flat>
              <thead>
                <tr>
                  <th class="text-left">Cantidad</th>
                  <th class="text-right">Descripción</th>
                  <th class="text-right">Precio (U)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pizza, index) in pizzas" :key="index">
                  <td class="text-left">1</td>
                  <td class="text-right">
                    {{ pizza.specialty1.name }}
                    <span v-if="pizza.specialty2 != null">- {{ pizza.specialty2.name }}</span>
                  </td>
                  <td class="text-right">{{ formatter.format(pizza.size.price) }}</td>
                </tr>

                <tr v-for="(drink, index) in orderDrinks" :key="index">
                  <td class="text-left">{{ drink.quantity }}</td>
                  <td class="text-right">{{ drink.name }}</td>
                  <td class="text-right">{{ formatter.format(drink.price) }}</td>
                </tr>

                <tr v-for="(complement, index) in orderComplements" :key="index">
                  <td class="text-left">{{ complement.quantity }}</td>
                  <td class="text-right">{{ complement.name }}</td>
                  <td class="text-right">{{ formatter.format(complement.price) }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="text-right">Subtotal:</td>
                  <td class="text-right">{{ formatter.format(subtotal) }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="text-right">IVA:</td>
                  <td class="text-right">{{ formatter.format(iva) }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="text-right">Total:</td>
                  <td class="text-right">{{ formatter.format(total) }}</td>
                </tr>
                <tr class="q-tr--no-hover">
                  <td></td>
                  <td class="text-right">Forma de Pago:</td>
                  <td class="text-right">
                    <q-select :options="paymentTypes" v-model="paymentSelected" dense></q-select>
                  </td>
                </tr>
                <tr class="q-tr--no-hover">
                  <td></td>
                  <td></td>
                  <td class="text-right">
                    <q-btn>Pagar</q-btn>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <!-- FIN RESUMEN -->
          </q-card-section>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { useStore } from 'vuex'
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'

import SizesService from 'src/services/sizes.service'
import SpecialtiesService from 'src/services/specialties.service'
import IngredientsService from 'src/services/ingredients.service'
import DrinksService from 'src/services/drinks.service'
import ComplementsService from 'src/services/complements.service'
import OrderTypeService from 'src/services/order_types.service'
import OrderService from 'src/services/order.service'

export default {
  props: ['show'],
  emits: ['onClose'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const store = useStore()
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

    onMounted(() => {
      store.dispatch('clients/fetchClients')
      fetchSizes()
      fetchSpecialties()
      fetchIngredients()
      fetchDrinks()
      fetchComplements()
      fetchOrderTypes()
      fetchPaymentTypes()
    })

    function close() {
      emit('onClose')
    }

    //client
    const selectedClient = ref(null)
    const clients = computed(() =>
      store.state.clients.clients.map((c) => ({
        ...c,
        label: c.first_name,
        value: c.id,
      }))
    )
    const filteredClients = ref([])
    const filterClients = (val, update) => {
      if (val === '') return update(() => (filteredClients.value = clients.value))

      const needle = val.toLowerCase()
      update(() => {
        filteredClients.value = clients.value.filter((c) => c.label.toLowerCase().indexOf(needle) > -1)
      })
    }
    function updateClient(client, init) {
      const update = { id: selectedClient.value.id, ...selectedClient.value.address }
      store.dispatch('clients/updateClient', update)
    }

    //pizzas
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
        console.log(pizza)
        pizzas.value.push(pizza)
        resetPizza()
      }
    }

    //Bebidas
    const drinks = ref([])
    const filteredDrinks = ref([])
    const drinkSelected = ref(null)
    const orderDrinks = ref([])
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
        const exists = orderDrinks.value.find((d) => d.id == drinkSelected.value.id)
        if (!exists) return orderDrinks.value.push({ quantity: 1, ...drinkSelected.value })

        orderDrinks.value = orderDrinks.value.map((d) => {
          if (d.id == drinkSelected.value.id) d.quantity++
          return d
        })
      }
    }

    //complementos
    const complements = ref([])
    const complementSelected = ref(null)
    const orderComplements = ref([])
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

    //tipos de reparto
    const orderTypes = ref([])
    const orderType = ref(null)
    async function fetchOrderTypes() {
      const resp = await OrderTypeService.fetchAll()
      orderTypes.value = resp.map((r) => ({ ...r, value: r.id, label: r.name }))
    }

    //pedido
    const observations = ref(null)
    const total = computed(() => {
      const tPizza = pizzas.value.map((r) => r.size.price).reduce((p, c) => Number(p) + Number(c), 0)
      const tDrinks = orderDrinks.value.map((d) => d.price * d.quantity).reduce((p, c) => Number(p) + Number(c), 0)
      const tComple = orderComplements.value.map((c) => c.price * c.quantity).reduce((p, c) => Number(p) + Number(c), 0)
      return tPizza + tDrinks + tComple
    })
    const iva = computed(() => total.value * 0.16)
    const subtotal = computed(() => total.value - iva.value)
    const paymentTypes = ref([])
    const paymentSelected = ref(null)
    async function fetchPaymentTypes() {
      const resp = await OrderService.fetchPaymentTypes()
      paymentTypes.value = resp.map((r) => ({ ...r, value: r.id, label: r.name }))
    }

    return {
      close,
      selectedClient,
      filteredClients,
      filterClients,
      updateClient,
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
      filteredDrinks,
      drinkSelected,
      filterDrinks,
      addDrink,
      orderDrinks,
      complements,
      complementSelected,
      orderComplements,
      addComplement,
      orderTypes,
      orderType,
      observations,
      total,
      subtotal,
      iva,
      formatter,
      paymentTypes,
      paymentSelected,
    }
  },
}
</script>
