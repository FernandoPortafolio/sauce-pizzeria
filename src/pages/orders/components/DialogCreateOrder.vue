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

              <ClientFraction @onChangeClient="selectClient"></ClientFraction>
            </fieldset>
            <!-- FIN CLIENTE -->

            <!-- PIZZAS -->
            <fieldset class="q-mt-md">
              <legend>Pizzas</legend>

              <PizzaFraction @onAddPizza="addPizza"></PizzaFraction>
            </fieldset>
            <!-- FIN PIZZAS -->

            <!-- BEBIDAS -->
            <fieldset class="q-mt-md">
              <legend>Bebidas</legend>
              <DrinksFraction @onAddDrink="addDrink"></DrinksFraction>
            </fieldset>
            <!-- FIN BEBIDAS -->

            <!-- COMPLEMENTOS -->
            <fieldset class="q-mt-md">
              <legend>Complementos</legend>
              <ComplementsFraction @onAddComplement="addComplement"></ComplementsFraction>
            </fieldset>
            <!-- FIN COMPLEMENTOS -->

            <ObservationsFraction
              @onChangeOrderType="changeOrderType"
              @onChangeObservations="(o) => (observations = o)"
            ></ObservationsFraction>
          </q-card-section>
        </div>

        <div class="col-12 col-md-6">
          <q-card-section>
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
                  <td class="text-right text-bold">Subtotal:</td>
                  <td class="text-right">{{ formatter.format(subtotal) }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="text-right text-bold">IVA:</td>
                  <td class="text-right">{{ formatter.format(iva) }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="text-right text-bold">Total:</td>
                  <td class="text-right">{{ formatter.format(total) }}</td>
                </tr>
                <tr class="q-tr--no-hover">
                  <td></td>
                  <td class="text-right text-bold">Forma de Pago:</td>
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
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'

import ClientFraction from './ClientFraction.vue'
import PizzaFraction from './PizzaFraction.vue'
import DrinksFraction from './DrinksFraction.vue'
import ComplementsFraction from './ComplementsFraction.vue'
import ObservationsFraction from './ObservationsFraction'

import OrderService from 'src/services/order.service'

export default {
  components: { ClientFraction, PizzaFraction, DrinksFraction, ComplementsFraction, ObservationsFraction },
  props: ['show'],
  emits: ['onClose'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

    onMounted(() => {
      fetchPaymentTypes()
    })

    function close() {
      emit('onClose')
    }

    //client
    const selectedClient = ref(null)
    function selectClient(c) {
      selectedClient.value = c
    }

    //pizzas
    const pizzas = ref([])
    function addPizza(pizza) {
      console.log(pizza)
      pizzas.value.push(pizza)
    }

    //Bebidas
    const orderDrinks = ref([])
    function addDrink(drink) {
      const exists = orderDrinks.value.find((d) => d.id == drink.id)
      if (!exists) return orderDrinks.value.push({ quantity: 1, ...drink })

      orderDrinks.value = orderDrinks.value.map((d) => {
        if (d.id == drink.id) d.quantity++
        return d
      })
    }

    //complementos
    const orderComplements = ref([])
    function addComplement(complement) {
      const exists = orderComplements.value.find((d) => d.id == complement.id)
      if (!exists) return orderComplements.value.push({ quantity: 1, ...complement })

      orderComplements.value = orderComplements.value.map((d) => {
        if (d.id == complement.id) d.quantity++
        return d
      })
    }

    //observations
    const orderType = ref(null)
    const observations = ref(null)
    function changeOrderType(t) {
      orderType.value = t
    }

    //pedido
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
      selectClient,
      addPizza,
      pizzas,
      addDrink,
      orderDrinks,
      orderComplements,
      addComplement,
      orderType,
      changeOrderType,
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
