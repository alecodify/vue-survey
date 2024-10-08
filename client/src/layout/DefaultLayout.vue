<script>
    import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
    import { useStore } from 'vuex';
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    import Notification from '@/components/Notification.vue';
    import Button from '@/components/Button.vue';

    const navigation = [
        {name: "Dashboard", to: {name: "Dashboard"}},
        {name: "surveys", to: {name: "Surveys"}},
    ]

    export default {
        components: {
            Disclosure,
            Disclosure,
            DisclosurePanel,
            DisclosureButton,
            Menu,
            MenuButton,
            MenuItem,
            MenuItems,
            Button,
            Notification,
        },

        setup() {
            const store = useStore();
            const router = useRouter();

            function logout(){
                store.dispatch('logout').then(() => {
                    router.push({
                        name: 'Login',
                    })
                })
            }

            store.dispatch('getUser');

            return {
              user: computed(() => store.state.user.data),
              navigation,
              logout
            }
        }
    }

</script>

<template>
  <div class="min-h-full">
    <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img
                class="h-24 w-24"
                src="../assets/logo.png"
                alt="Workflow"
              />
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <router-link
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.to"
                  active-class="bg-gray-900 text-white"
                  :class="[
                    this.$route.name === item.to.name
                      ? ''
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'px-3 py-2 rounded-md text-sm font-medium',
                  ]"
                  >{{ item.name }}
                </router-link>
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <Menu as="div" class="ml-3 relative">
                <div v-if="user.email">
                  <MenuButton
                    class="max-w-xs px-2 py-1 bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span class="sr-only">Open user menu</span>

                    <div class="mx-3">
                      <div class="text-sm font-medium leading-none text-gray-400">{{ user.email }}</div>
                    </div>
                    <i class="pi pi-user text-lg text-white"></i>
                  </MenuButton>
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <MenuItem v-slot="{}">
                        <a
                          @click="logout"
                          :class="[ 'block px-4 py-2 text-sm text-gray-700 cursor-pointer', ]"
                        >
                          Sign out
                        </a>
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </div>

                <div v-else class="flex items-center justify-between gap-4">
                  <Button :to="{ name: 'Login' }" link class="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white">
                    Login
                  </Button>
                  <Button :to="{ name: 'Register' }" link class="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white">
                    Register
                  </Button>
                </div>
              </Menu>
            </div>
          </div>

          <div class="-mr-2 flex md:hidden">
            <DisclosureButton class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" >
              <span class="sr-only">Open main menu</span>
              <i v-if="!open" class="pi pi-bars text-xl"></i>
              <i v-else class="pi pi-times text-xl"></i>
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            active-class="bg-gray-900 text-white"
            :class="[
              this.$route.name === item.to.name
                ? ''
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block px-3 py-2 rounded-md text-base font-medium',
            ]"
            >{{ item.name }}
          </router-link>
        </div>

        <div class="pt-4 pb-3 border-t border-gray-700">
          <div v-if="user.email" class="flex items-center px-5">
            <div class="flex-shrink-0">
              <i class="pi pi-user text-lg text-white"></i>
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium leading-none text-gray-400">{{ user.email }}</div>
            </div>
          </div>

          <div v-else class="px-5 flex flex-col gap-3">
            <a href="/register" class="text-white text-md font-semibold hover:text-gray-300 hover:bg-gray-700 py-2 px-1 rounded-md"><i class="pi pi-user-plus mr-2"></i>Register</a>
            <a href="/login" class="text-white text-md font-semibold hover:text-gray-300 hover:bg-gray-700 py-2 px-1 rounded-md"><i class="pi pi-sign-in mr-2"></i>Login</a>
          </div>

          <div v-if="user.email" class="mt-3 px-2 space-y-1">
            <DisclosureButton
              as="a"
              @click="logout"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer"
              >Sign out</DisclosureButton
            >
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <router-view :key="$route.path"></router-view>

    <Notification />
  </div>
</template>