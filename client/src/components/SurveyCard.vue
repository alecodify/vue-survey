<script setup>
    import { computed } from 'vue';
    import Button from './Button.vue';
    import store from '@/store';

    const isAdmin = computed(() => store.state.user.isAdmin);

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
        
        <div v-if="isAdmin" class="flex justify-between items-center mt-3">
            <div class="flex gap-2">
                <Button :to="{name: 'SurveyView', params: { id: survey._id } }">
                    <i class="pi pi-pen-to-square text-white text-lg mr-1"></i>
                    Edit
                </Button>
    
                <div v-if="survey.isActive !== undefined" class="py-2 px-4 text-sm font-semibold rounded-md select-none"
                    :class="{
                        'bg-green-200 text-green-800': survey.isActive,
                        'bg-yellow-200 text-red-800': !survey.isActive
                    }">
                    {{ survey.isActive ? 'Active' : 'Closed' }}
                </div>
            </div>

            <div class="flex items-center gap-4 justify-end">
                <a :href="`/surveys/result/${survey._id}`" class="bg-orange-500 text-sm h-8 w-8 justify-center items-center flex rounded-full">
                    <i class="pi pi-eye text-white text-lg"></i>
                </a>

                <Button :href="`/view/survey/${survey._id}`" circle color="green">
                    <i class="pi pi-external-link text-white text-lg"></i>
                </Button>

                <Button v-if="survey._id" @click="emit('delete', survey)" circle color="red">
                    <i class="pi pi-trash text-white text-lg"></i>
                </Button>
            </div>
        </div>

        <div v-else  class="w-full flex gap-2 justify-end">
            <div v-if="survey.isActive !== undefined" class="flex gap-2 text-sm items-center font-semibold select-none">
                status: 
                <div class="py-2 px-3 rounded-md" :class="{
                        'bg-green-200 text-green-800': survey.isActive,
                        'bg-yellow-200 text-red-800': !survey.isActive 
                    }">
                    {{ survey.isActive ? 'Active' : 'Closed' }}
                </div>
            </div>
            <Button :href="`/view/survey/${survey._id}`" circle color="green">
                <i class="pi pi-external-link text-white text-lg"></i>
            </Button>
        </div>
    </div>
</template>