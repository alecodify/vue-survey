<script setup>
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import store from '@/store';
    import Button from '@/components/Button.vue';
    import Alert from '@/components/Alert.vue';

    const router = useRouter();

    const user = {
        email: "",
        password: "",
    }

    let loading = ref(false);
    const errorMessage = ref("");

    function login(event) {
        event.preventDefault();
        
        loading.value = true;

        store.dispatch('login', user).then(() => {
            loading.value =  false;
            router.push({
                name: 'Dashboard',
            })
        }).catch((error) => {
            loading.value = false;
            
            if (error.response.data.status === 'Failed') {
                errorMessage.value = error.response.data.error;
            }
        })
    }

</script>

<template>
    <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Or
            {{ " " }}
            <router-link :to="{ name: 'Register' }" class="font-medium text-indigo-600 hover:text-indigo-500">
              register for free
            </router-link>
        </p>
    </div>

    <form class="mt-8 space-y-6" @submit="login">
        <Alert v-if="errorMessage">
           {{ errorMessage }}
        </Alert>
           
        <div class="rounded-md shadow-sm -space-y-px">
            <div>
                <label for="email-address" class="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required=""
                  v-model="user.email"
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label for="password" class="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required=""
                  v-model="user.password"
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
        </div>
    
    
        <div>
          <Button class="w-full flex gap-1 justify-center">
            <span class="flex items-center">
                <i class="pi pi-lock text-lg text-indigo-500 group-hover:text-indigo-400"></i>
            </span>
            Sign in
          </Button>
        </div>
    </form>
</template>