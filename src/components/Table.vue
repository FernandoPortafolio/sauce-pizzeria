<template>
  <q-table
    :title="title"
    rows-per-page-label="Registros por página"
    :rows="rows"
    :columns="columns"
    :filter="filter"
    :row-key="rowKey"
    :loading="loading"
  >
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
        <slot name="actions" :row="props.row"> </slot>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  props: {
    title: { required: true },
    rows: { required: true },
    columns: { required: true },
    filter: { default: null },
    loading: { default: true },
    rowKey: { required: true, type: String },
  },
}
</script>

<style></style>
