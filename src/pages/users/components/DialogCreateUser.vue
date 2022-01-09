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
            <div class="col-12 q-mt-md">
              <div class="row items-center">
                <p class="q-ma-none q-mr-sm">Roles</p>
                <q-btn round color="dark" icon="add" size="xs" @click="showRoleSelector = true" />
              </div>

              <ul>
                <div class="row items-center" v-for="role in form.roles" :key="role">
                  <li class="q-mr-sm">{{ getRoleName(role) }}</li>
                  <q-btn @click="deleteRole(role)" icon="delete" text-color="negative" flat round size="sm"></q-btn>
                </div>
              </ul>

              <q-select
                v-model="roleId"
                :options="roleOptions"
                label="Rol"
                emit-value
                map-options
                v-show="showRoleSelector"
                @update:model-value="(v) => addRole(v)"
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
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'

import UsersService from 'src/services/users.service'

export default {
  props: {
    show: { default: false },
  },
  emits: ['onClose', 'onSave'],
  setup(props, { emit }) {
    const store = useStore()
    const roles = computed(() => store.state.auth.roles)
    const roleOptions = computed(() =>
      store.state.auth.roles.map((r) => ({
        label: r.name,
        value: r.id,
      }))
    )
    const roleId = ref(null)
    const showRoleSelector = ref(false)

    const form = reactive({
      name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      roles: [],
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

    function addRole(role_id) {
      if (!form.roles.includes(role_id)) form.roles.push(role_id)
      showRoleSelector.value = false
      roleId.value = null
    }

    function deleteRole(role_id) {
      form.roles = form.roles.filter((r) => r != role_id)
    }

    function getRoleName(role_id) {
      return roles.value.find((r) => r.id == role_id).name
    }

    function resetForm() {
      form.name = ''
      form.last_name = ''
      form.email = ''
      form.password = ''
      form.password_confirmation = ''
      form.roles = []
      roleId.value = null
    }

    return { close, roleOptions, showRoleSelector, addRole, deleteRole, roleId, getRoleName, form, saveUser }
  },
}
</script>

<style></style>
