<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import Button from '@/components/Button.vue';
    import Input from '@/components/Input.vue';
    import store from '@/store';
    import Alert from '@/components/Alert.vue';

    const router = useRouter();
    const user = ref({
        name: "",
        email: "",
        password: "",
    });

    const loading = ref(false);
    const errors = ref({});

    function validateForm() {
        errors.value = {};
        
        if (!user.value.name) {
            errors.value.name = ["Name is required"];
        }

        if (!user.value.email) {
            errors.value.email = ["Email is required"];
        }

        if (!user.value.password) {
            errors.value.password = ["Password is required"];
        }

        return Object.keys(errors.value).length === 0;
    }

    function register(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        loading.value = true;
        
        store.dispatch("register", user.value).then(() => {
            loading.value = false;
            router.push({
                name: "Login",
            });
        }).catch((error) => {
            loading.value = false;
            if (error.response.data.status === 'Failed') {
                errors.value = error.response.data.message;
            }
        });
    }
</script>

<template>
    <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Register for free</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <router-link
              :to="{ name: 'Login' }"
              class="font-medium text-indigo-600 hover:text-indigo-500">
              login to your account
            </router-link>
        </p>
    </div>

    <form class="mt-8 space-y-6" @submit="register">
        <Alert
            v-if="Object.keys(errors).length"
            class="flex items-center justify-start text-sm">
            <div v-for="(fieldErrors, fieldName) in errors" :key="fieldName">
                <div v-for="(errorMessage, index) in fieldErrors" :key="index">
                     {{ errorMessage }}
                </div>
            </div>
        </Alert>
        
        <div class="rounded-md shadow-sm -space-y-px">
            <Input
                name="name"
                v-model="user.name"
                :errors="errors"
                placeholder="Full Name"
                inputClass="rounded-t-md"
            />

            <Input
                type="email"
                name="email"
                v-model="user.email"
                :errors="errors"
                placeholder="Email Address"
            />

            <Input
                type="password"
                name="password"
                v-model="user.password"
                :errors="errors"
                placeholder="Password"
            />

        </div>

        <div>
            <Button class="w-full relative justify-center">Sign up</Button>
        </div>
    </form>
</template>
