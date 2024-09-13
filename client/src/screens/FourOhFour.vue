<script setup>
    import { RouterLink, useRoute } from 'vue-router';

    const route = useRoute();
    const message = route.query.message || ''; 
</script>

<template>
    <section class="text-center flex flex-col justify-center items-center h-screen">
        <h1 class="text-6xl font-bold mb-2 text-red-500">404</h1>
        <h1 class="text-4xl font-semibold mb-4">Not Found</h1>
        <p v-if="message" class="text-xl text-red-500 mb-4">{{ message }}</p>
        <p v-else class="text-xl mb-5">This page does not exist</p>
        <RouterLink to="/" class="text-white bg-green-600 hover:bg-green-500 rounded-md px-3 py-2 mt-4">Go Back</RouterLink>
    </section>
</template>