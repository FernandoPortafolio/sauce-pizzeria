<template>
  <q-page padding>
    <q-card class="my-card q-mb-lg">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title> Configuración </q-toolbar-title>
        </q-toolbar>
      </q-card-section>

      <q-tabs v-model="tab" class="text-teal" align="left">
        <q-tab name="mass_type" label="Tipos de Masa" />
        <q-tab name="ingredients" label="Ingredientes" />
        <q-tab name="specialties" label="Especialidadades" />
        <q-tab name="complements" label="Complementos" />
        <q-tab name="sizes" label="Tamaños" />
        <q-tab name="drinks" label="Bebidas" />
        <q-tab name="order_type" label="Tipos de pedido" />
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated keep-alive>
      <q-tab-panel name="mass_type">
        <TabMassType></TabMassType>
      </q-tab-panel>
      <q-tab-panel name="ingredients">
        <TabIngredients></TabIngredients>
      </q-tab-panel>
      <q-tab-panel name="specialties">
        <TabSpecialties></TabSpecialties>
      </q-tab-panel>
      <q-tab-panel name="complements">
        <TabComplements></TabComplements>
      </q-tab-panel>
      <q-tab-panel name="sizes">
        <TabSizes></TabSizes>
      </q-tab-panel>
      <q-tab-panel name="drinks">
        <TabDrinks></TabDrinks>
      </q-tab-panel>
      <q-tab-panel name="order_type">
        <TabOrdersType></TabOrdersType>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import TabDrinks from './components/TabDrinks.vue'
import TabOrdersType from './components/TabOrdersType.vue'
import TabSizes from './components/TabSizes.vue'
import TabSpecialties from './components/TabSpecialties.vue'
import TabComplements from './components/TabComplements.vue'
import TabIngredients from './components/TabIngredients.vue'
import TabMassType from './components/TabMassType.vue'
import { ref } from 'vue'
export default {
  components: {
    TabMassType,
    TabIngredients,
    TabSpecialties,
    TabComplements,
    TabSizes,
    TabDrinks,
    TabOrdersType,
  },
  setup() {
    const tab = ref('mass_type')
    return { tab }
  },
}
</script>

<style></style>
