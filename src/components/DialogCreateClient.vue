<template>
  <q-dialog v-model="show" @hide="close">
    <q-card style="width: 700px; max-width: 80vw" class="q-px-lg q-py-xs">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Nuevo Cliente</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form action="#" @submit.prevent="saveClient">
          <div class="row q-col-gutter-x-lg">
            <div class="col">
              <q-input
                v-model="form.first_name"
                autocomplete="none"
                type="text"
                label="Nombre(s)"
                :rules="[(val) => (val && val.length > 0) || 'El nombre es requerido']"
              />
            </div>
            <div class="col">
              <q-input
                v-model="form.last_name"
                autocomplete="none"
                type="text"
                label="Apellido(s)"
                :rules="[(val) => (val && val.length > 0) || 'El apellido es requerido']"
              />
            </div>
            <div class="col">
              <q-input v-model="form.phone" autocomplete="none" type="text" label="Teléfono" />
            </div>
          </div>

          <fieldset class="q-mt-sm">
            <legend>Dirección</legend>
            <div class="row q-col-gutter-x-sm">
              <div class="col-8">
                <q-input v-model="form.street" autocomplete="none" type="text" label="Calle" />
              </div>
              <div class="col-4">
                <q-input v-model="form.number" autocomplete="none" type="text" label="Número" prefix="#" />
              </div>
              <div class="col-12">
                <q-input v-model="form.colony" autocomplete="none" type="text" label="Colonia" />
              </div>
            </div>
          </fieldset>

          <q-card-actions align="right">
            <q-btn flat type="submit">Guardar</q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import ClientService from 'src/services/clients.service'

export default {
  props: {
    show: { default: false },
  },
  emits: ['onClose', 'onSave'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const store = useStore()

    const form = reactive({
      first_name: '',
      last_name: '',
      phone: '',
      street: '',
      number: '',
      colony: '',
    })

    function close() {
      emit('onClose')
      resetForm()
    }

    async function saveClient() {
      try {
        const client = { ...form }
        const newClient = await ClientService.create(client)
        store.commit('clients/ADD_CLIENT', newClient)
        emit('onSave', newClient)
        $q.notify({
          message: 'Cliente creado',
          color: 'dark',
        })
        close()
      } catch (error) {
        console.log(error)
      }
    }

    function resetForm() {
      form.first_name = ''
      form.last_name = ''
      form.phone = ''
      form.street = ''
      form.number = ''
      form.colony = ''
    }

    return { close, form, saveClient }
  },
}
</script>
