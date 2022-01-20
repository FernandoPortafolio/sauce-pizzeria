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
          <q-tabs v-model="tab" class="text-teal">
            <q-tab name="client" label="Cliente" />
            <q-tab name="pizzas" label="Pizzas" />
            <q-tab name="drinks" label="Bebidas" />
            <q-tab name="complements" label="Complementos" />
            <q-tab name="observations" label="Observaciones" />
          </q-tabs>

          <q-card-section>
            <q-tab-panels v-model="tab" animated keep-alive>
              <q-tab-panel name="client">
                <fieldset>
                  <legend>Cliente</legend>
                  <ClientFraction></ClientFraction>
                </fieldset>
              </q-tab-panel>
              <q-tab-panel name="pizzas">
                <fieldset class="q-mt-md">
                  <legend>Pizzas</legend>

                  <PizzaFraction></PizzaFraction>
                </fieldset>
              </q-tab-panel>
              <q-tab-panel name="drinks">
                <fieldset class="q-mt-md">
                  <legend>Bebidas</legend>
                  <DrinksFraction></DrinksFraction>
                </fieldset>
              </q-tab-panel>
              <q-tab-panel name="complements">
                <fieldset class="q-mt-md">
                  <legend>Complementos</legend>
                  <ComplementsFraction></ComplementsFraction>
                </fieldset>
              </q-tab-panel>
              <q-tab-panel name="observations">
                <ObservationsFraction></ObservationsFraction>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </div>

        <div class="col-12 col-md-6">
          <q-card-section>
            <p class="text-bold q-mt-sm">Resumen Del Pedido</p>
            <p>
              <span class="text-bold">Cliente</span>: {{ selectedClient?.first_name }} {{ selectedClient?.last_name }}
            </p>
            <q-markup-table separator="none" flat dense>
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
                    {{ pizza.size.name }}
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
                    <q-btn @click="pay">Pagar</q-btn>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <p><span class="text-bold">Tipo de Orden: </span>{{ orderType?.name }}</p>
            <p><span class="text-bold">Observaciones: </span>{{ observations }}</p>

            <!-- FIN RESUMEN -->
          </q-card-section>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, onMounted, ref, provide, inject } from 'vue'
import { useQuasar } from 'quasar'

import ClientFraction from './ClientFraction.vue'
import PizzaFraction from './PizzaFraction.vue'
import DrinksFraction from './DrinksFraction.vue'
import ComplementsFraction from './ComplementsFraction.vue'
import ObservationsFraction from './ObservationsFraction'

import OrderService from 'src/services/order.service'

export default {
  components: {
    ClientFraction,
    PizzaFraction,
    DrinksFraction,
    ComplementsFraction,
    ObservationsFraction,
  },
  props: ['show'],
  emits: ['onClose'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    const tab = ref('client')

    onMounted(() => {
      fetchPaymentTypes()
    })

    function close() {
      emit('onClose')
    }

    const orders = inject('orders')

    //client
    const selectedClient = ref(null)
    provide('selectedClient', selectedClient)

    //pizzas
    const pizzas = ref([])
    provide('pizzas', pizzas)

    //Bebidas
    const orderDrinks = ref([])
    provide('orderDrinks', orderDrinks)

    //complementos
    const orderComplements = ref([])
    provide('orderComplements', orderComplements)

    //observations
    const orderType = ref(null)
    const observations = ref(null)
    provide('orderType', orderType)
    provide('observations', observations)

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

    function validateOrder() {
      let message = null
      if (selectedClient.value == null) message = 'Selecciona un cliente'
      else if (orderType.value == null) message = 'Selecciona el tipo de pedido'
      else if (paymentSelected.value == null) message = 'Selecciona el tipo de pago'

      if (message != null) {
        $q.notify({
          message,
          color: 'negative',
          timeout: 1000,
        })
        return false
      }

      return true
    }

    async function pay() {
      if (!validateOrder()) return
      const order = {
        client_id: selectedClient.value.id,
        pizzas: pizzas.value.map((p) => {
          return {
            ingredients: p.ingredients.map((i) => ({ id: i.id, half: i.half })),
            size: p.size.id,
            mass_type: p.mass_type.id,
            specialty1: p.specialty1.id,
            specialty2: p.specialty2?.id,
          }
        }),
        drinks: orderDrinks.value.map((d) => ({ id: d.id, quantity: d.quantity })),
        complements: orderComplements.value.map((c) => ({ id: c.id, quantity: c.quantity })),
        observations: observations.value,
        total: total.value,
        payment_type: paymentSelected.value.id,
        order_type: orderType.value.id,
      }

      const newOrder = await OrderService.createOrder(order)
      console.log(newOrder)
      orders.value.push(newOrder)
      close()
      reset()
    }

    function reset() {
      selectedClient.value = null
      pizzas.value = []
      orderDrinks.value = []
      orderComplements.value = []
      orderType.value = null
      observations.value = null
      paymentSelected.value = null
    }

    return {
      tab,
      close,
      selectedClient,
      pizzas,
      orderDrinks,
      orderComplements,
      orderType,
      observations,
      total,
      subtotal,
      iva,
      formatter,
      paymentTypes,
      paymentSelected,
      pay,
    }
  },
}
</script>
