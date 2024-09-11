<script setup>
    import { RouterLink } from 'vue-router';
</script>

<template>
    <section class="text-center flex flex-col justify-center items-center h-96">
        <h1 class="text-6xl font-bold mb-2 text-red-500">404</h1>
        <h1 class="text-4xl font-semibold mb-4">Not Found</h1>
        <p class="text-xl mb-5">This page does not exist</p>
        <RouterLink to="/" class="text-white bg-green-600 hover:bg-green-500 rounded-md px-3 py-2 mt-4">Go Back</RouterLink>
    </section>
</template>