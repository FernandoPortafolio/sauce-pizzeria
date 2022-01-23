<template>
  <q-dialog v-model="show" persistent maximized>
    <q-card class="bg-white">
      <q-bar class="bg-primary">
        <q-space />

        <q-btn dense flat icon="close" color="white" v-close-popup>
          <q-tooltip class="bg-primary text-white">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <div class="row">
        <div class="col-12 col-md-6">
          <q-tabs v-model="tab" class="text-teal">
            <q-tab name="client" icon="face" label="Cliente" />
            <q-tab name="pizzas" icon="local_pizza" label="Pizzas" />
            <q-tab name="drinks" icon="local_bar" label="Bebidas" />
            <q-tab name="complements" icon="tapas" label="Complementos" />
            <q-tab name="observations" icon="article" label="Observaciones" />
          </q-tabs>

          <q-card-section>
            <q-tab-panels v-model="tab" animated keep-alive>
              <q-tab-panel name="client">
                <fieldset>
                  <legend>Cliente</legend>
                  <p class="text-bold">Cliente:</p>
                  <p>{{ `${selectedOrder.client.first_name} ${selectedOrder.client.last_name}` }}</p>
                  <p class="text-bold">Dirección:</p>
                  <p>
                    Calle {{ selectedOrder.client.address.street }} #{{ selectedOrder.client.address.number }}. Colonia:
                    {{ selectedOrder.client.address.colony }}
                  </p>
                  <p class="text-bold">Tipo de Pedido:</p>
                  <p>{{ selectedOrder.order_type.name }}</p>
                </fieldset>
              </q-tab-panel>
              <q-tab-panel name="pizzas">
                <fieldset class="q-mt-md">
                  <legend>Pizzas</legend>

                  <div class="row">
                    <q-card bordered v-for="pizza in selectedOrder.pizzas" :key="pizza.id" class="col-6">
                      <q-card-section>
                        <div class="text-bold">
                          {{ pizza.specialty1.name }}
                          <span v-if="pizza.specialty2 != null">- {{ pizza.specialty2.name }}</span>
                        </div>
                        <div class="text-subtitle2">{{ pizza.size.name }}</div>
                      </q-card-section>

                      <q-separator inset />

                      <q-card-section>
                        <p><span class="text-bold">Tipo de masa: </span>{{ pizza.mass_type.name }}</p>

                        <p>
                          <span class="text-bold">Especialidad<span v-if="pizza.specialty2 != null"> 1</span>:</span>
                          {{ pizza.specialty1.name }}
                        </p>

                        <ul>
                          <li v-for="(ingredient, index) in getIngredients(pizza, 1)" :key="index">
                            {{ ingredient.name }}
                          </li>
                        </ul>

                        <template v-if="pizza.specialty2 != null">
                          <p><span class="text-bold">Especialidad 2:</span> {{ pizza.specialty2.name }}</p>
                          <ul>
                            <li v-for="(ingredient, index) in getIngredients(pizza, 2)" :key="index">
                              {{ ingredient.name }}
                            </li>
                          </ul>
                        </template>
                      </q-card-section>
                    </q-card>
                  </div>
                </fieldset>
              </q-tab-panel>
              <q-tab-panel name="drinks">
                <fieldset class="q-mt-md">
                  <legend>Bebidas</legend>
                  <ul>
                    <li v-for="drink in selectedOrder.drinks" :key="drink.id">
                      {{ drink.pivot.quantity }} {{ drink.name }}
                    </li>
                  </ul>
                </fieldset>
              </q-tab-panel>
              <q-tab-panel name="complements">
                <fieldset class="q-mt-md">
                  <legend>Complementos</legend>
                  <ul>
                    <li v-for="complement in selectedOrder.complements" :key="complement.id">
                      {{ complement.pivot.quantity }} {{ complement.name }}
                    </li>
                  </ul>
                </fieldset>
              </q-tab-panel>
              <q-tab-panel name="observations">
                {{ selectedOrder.observations || 'Sin observaciones' }}
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </div>

        <div class="col-12 col-md-6">
          <q-card-section>
            <p class="text-bold q-mt-sm">Resumen Del Pedido</p>
            <q-markup-table separator="none" flat dense>
              <thead>
                <tr>
                  <th class="text-left">Cantidad</th>
                  <th class="text-right">Descripción</th>
                  <th class="text-right">Precio (U)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pizza, index) in selectedOrder.pizzas" :key="index">
                  <td class="text-left">1</td>
                  <td class="text-right">
                    {{ pizza.specialty1.name }}
                    <span v-if="pizza.specialty2 != null">- {{ pizza.specialty2.name }}</span>
                    {{ pizza.size.name }}
                  </td>
                  <td class="text-right">{{ formatter.format(pizza.size.price) }}</td>
                </tr>

                <tr v-for="(drink, index) in selectedOrder.drinks" :key="index">
                  <td class="text-left">{{ drink.pivot.quantity }}</td>
                  <td class="text-right">{{ drink.name }}</td>
                  <td class="text-right">{{ formatter.format(drink.price) }}</td>
                </tr>

                <tr v-for="(complement, index) in selectedOrder.complements" :key="index">
                  <td class="text-left">{{ complement.pivot.quantity }}</td>
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
                  <td class="text-right">{{ formatter.format(selectedOrder.total) }}</td>
                </tr>
                <tr class="q-tr--no-hover">
                  <td></td>
                  <td class="text-right text-bold">Forma de Pago:</td>
                  <td class="text-right">
                    {{ selectedOrder.payment_type.name }}
                  </td>
                </tr>
                <tr class="q-tr--no-hover">
                  <td></td>
                  <td></td>
                  <td class="text-right">
                    <q-btn>Reimprimir Ticket</q-btn>
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
import { inject, ref, computed } from 'vue'
export default {
  props: {
    show: { required: true, type: Boolean },
  },
  setup() {
    const selectedOrder = inject('selectedOrder')
    const tab = ref('client')
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    const iva = computed(() => selectedOrder.value.total * 0.16)
    const subtotal = computed(() => selectedOrder.value.total - iva.value)

    function getIngredients(pizza, half) {
      return pizza.ingredients.filter((i) => i.half == half)
    }

    return { selectedOrder, tab, getIngredients, formatter, iva, subtotal }
  },
}
</script>

<style></style>
