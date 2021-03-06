<template>
  <q-layout view="lhh lpR lff">
    <q-header reveal elevated class="bg-dark text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-img class="absolute-top" src="/img/bg-pizza.jpg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">{{ user.name }} {{ user.last_name }}</div>
          <div>{{ user.email }}</div>
        </div>
      </q-img>

      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <div v-if="menuItem.show">
              <q-item clickable :active="menuItem.to === currentPath" v-ripple>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section @click="this.$router.push(menuItem.to)">
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </div>
          </template>
          <q-separator />
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section> Salir </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-9">
      <q-toolbar>
        <q-toolbar-title>
          <div>Title</div>
        </q-toolbar-title>
        <div>Designed by Fernando Acosta &copy;. All rights reserved {{ new Date().getFullYear() }}</div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AuthService from 'services/auth.service'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(false)
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const currentPath = ref('')

    const isAdmin = computed(() => store.getters['auth/isAdmin'])
    const user = computed(() => store.state.auth.user)

    watch(
      () => route.path,
      () => {
        currentPath.value = route.path
      },
      { immediate: true }
    )

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const menuList = [
      {
        icon: 'fas fa-users',
        label: 'Clientes',
        to: '/clientes',
        separator: false,
        show: true,
      },
      {
        icon: 'fas fa-utensils',
        label: 'Ordenes',
        to: '/ordenes',
        separator: true,
        show: true,
      },
      {
        icon: 'fas fa-users-cog',
        label: 'Usuarios',
        to: '/usuarios',
        separator: false,
        show: isAdmin.value,
      },
      {
        icon: 'settings',
        label: 'Configuración',
        to: '/settings',
        separator: false,
        show: isAdmin.value,
      },
    ]

    async function logout() {
      try {
        await AuthService.logout()
        store.commit('auth/LOGOUT')
        router.replace('/login')
      } catch (error) {
        console.log(error)
      }
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      menuList,
      currentPath,
      logout,
      user,
    }
  },
})
</script>
