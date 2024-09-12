<script setup>
    import Button from './Button.vue';
    import { defineProps, defineEmits } from 'vue';

    const { survey } = defineProps({
        survey: {
            type: Object
        }
    })

    const emit = defineEmits(['delete', 'edit']);

</script>

<template>
    <div class="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50 h-[470px]">
        <img :src="survey.image || 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'" :alt="survey.title" class="w-full h-48 object-cover">
        <h4 class="mt-4 text-lg font-bold">{{ survey.title }}</h4>
        <div v-html="survey.description" class="overflow-hidden flex-1"></div>

        <div class="flex justify-between items-center mt-3">
            <Button :to="{name: 'SurveyView', params: { id: survey._id } }">
                <i class="pi pi-pen-to-square text-white text-lg mr-1"></i>
                Edit
            </Button>

            <div class="flex items-center gap-4">
                <Button :href="`/view/survey/${survey._id}`" circle color="green">
                    <i class="pi pi-external-link text-white text-lg"></i>
                </Button>

                <Button v-if="survey._id" @click="emit('delete', survey)" circle color="red">
                    <i class="pi pi-trash text-white text-lg"></i>
                </Button>
            </div>
        </div>
    </div>
</template>