<template>
  <q-dialog v-model="show" @hide="close">
    <q-card style="width: 700px; max-width: 80vw" class="q-px-lg q-py-xs">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Nuevo usuario</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form action="#" @submit.prevent="saveUser">
          <div class="row q-col-gutter-x-lg">
            <div class="col">
              <q-input
                v-model="form.name"
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
            <div class="col-12">
              <q-input
                v-model="form.email"
                autocomplete="none"
                type="email"
                label="Email"
                :rules="[(val) => (val && val.length > 0) || 'El email es requerido']"
              />
            </div>
            <div class="col">
              <q-input
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                label="Contraseña"
                :rules="[(val) => (val && val.length > 0) || 'La contraseña es requerida']"
              />
            </div>
            <div class="col">
              <q-input
                v-model="form.password_confirmation"
                autocomplete="new-password"
                type="password"
                label="Repite la contraseña"
                :rules="[
                  (val) => (val && val.length > 0) || 'Repite tu contraseña',
                  (val) => val == form.password || 'Las contraseñas no coinciden',
                ]"
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="form.role_id"
                :options="roleOptions"
                label="Rol"
                emit-value
                map-options
                :rules="[(val) => val != 0 || 'Selecciona un rol']"
              />
            </div>
          </div>

          <q-card-actions align="right">
            <q-btn flat type="submit">Guardar</q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'

import UsersService from 'src/services/users.service'

export default {
  props: {
    show: { default: false },
  },
  emits: ['onClose', 'onSave'],
  setup(props, { emit }) {
    const store = useStore()
    const roleOptions = computed(() =>
      store.state.auth.roles.map((r) => ({
        label: r.name,
        value: r.id,
      }))
    )

    const form = reactive({
      name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role_id: '',
    })

    function close() {
      emit('onClose')
      resetForm()
    }

    async function saveUser() {
      try {
        const newUser = await UsersService.registerUser(form)
        emit('onSave', newUser)
        close()
      } catch (error) {
        console.log(error)
      }
    }

    function resetForm() {
      form.name = ''
      form.last_name = ''
      form.email = ''
      form.password = ''
      form.password_confirmation = ''
      form.role_id = ''
    }

    return { close, roleOptions, form, saveUser }
  },
}
</script>

<style></style>
