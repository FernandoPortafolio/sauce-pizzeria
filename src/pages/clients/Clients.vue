<template>
  <q-page padding>
    <q-card class="my-card q-mb-lg">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title> Administración de Clientes </q-toolbar-title>
          <q-btn class="q-mr-sm" flat dense round icon="add" />
        </q-toolbar>
      </q-card-section>
    </q-card>

    <q-table title="Clientes" :rows="rows" :columns="columns" :filter="filter" row-key="phone">
      <template #top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template #header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th><!-- Actions --></q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-td :props="props" v-for="col in props.cols" :key="col.name">{{ col.value }}</q-td>
          <q-td style="width: 120px">
            <div class="text-center">
              <q-btn flat dense round icon="edit" class="q-mr-sm" />
              <q-btn flat dense round icon="delete_outline" />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref } from 'vue'

const columns = [
  {
    name: 'name',
    label: 'Nombre',
    align: 'left',
    field: (row) => `${row.first_name} ${row.last_name}`,
    sortable: true,
  },
  {
    name: 'phone',
    label: 'Teléfono',
    field: 'phone',
    sortable: true,
  },
]

const rows = [
  {
    first_name: 'Luis Fernando',
    last_name: 'Acosta Tovar',
    phone: '4111267600',
  },
  {
    first_name: 'Jose Luis',
    last_name: 'Acosta Tovar',
    phone: '4111346576',
  },
]

export default {
  setup() {
    const filter = ref('')
    const selected = ref([])

    return {
      columns,
      rows,
      filter,
      selected,
    }
  },
}
</script>
