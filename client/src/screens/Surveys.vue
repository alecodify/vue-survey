<script setup>
    import { computed, ref } from 'vue';
    import store from '@/store';
    import Button from '@/components/Button.vue';
    import PageComponent from '@/components/PageComponent.vue';
    import SurveyCard from '@/components/SurveyCard.vue';

    const surveys = computed(() => store.state.surveys.data);
    const loading = computed(() => store.state.surveys.loading);
    const isAdmin = computed(() => store.state.user.isAdmin);

    store.dispatch('getSurveys');

    function deleteSurvey(survey){
        if (confirm(`Are you sure you want to delete this survey? Operation cann't be undone!!`)) {
            store.dispatch('deleteSurvey', survey._id).then(() => store.dispatch('getSurveys'));  
        }
    }

    const currentPage = ref(1);
    const surveysPerPage = 6;

    const paginatedSurveys = computed(() => {
        const start = (currentPage.value - 1) * surveysPerPage;
        const end = start + surveysPerPage;
        return surveys.value.slice(start, end);
    });

    const totalPages = computed(() => Math.ceil(surveys.value.length / surveysPerPage));

    function changePage(page) {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
        }
    }

</script>


<template>
    <PageComponent>
        <template v-slot:header>
            <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-900 ">Surveys</h1>
                <Button v-if="isAdmin" color="green" :to="{name: 'SurveyCreate'}">
                    <i class="pi pi-plus text-white text-lg mr-2"></i>
                    Add new Survey
                </Button>
            </div>
        </template>

        <div v-if="loading" class="flex justify-center">Loading...</div>
        
        <div v-else-if="paginatedSurveys.length">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                <SurveyCard v-for="(survey, index) in paginatedSurveys" :key="survey._id" :survey="survey" @delete="deleteSurvey(survey)" 
                    class="opacity-0 animate-fade-in-down" :style="{ animationDelay: `${index * 0.1}s` }"
                />
            </div>

            <div class="flex justify-center mt-5">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm" aria-label="Pagination">
                    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" 
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                    </button>
          
                    <span class="relative inline-flex items-center px-4 py-2 border text-sm font-medium text-gray-700"> Page {{ currentPage }} of {{ totalPages }} </span>
          
                    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                    </button>
                  </nav>
            </div>
        </div>

        <div v-else class="text-gray-600 text-center py-16">
            Your don't have surveys yet
        </div>
    </PageComponent>
</template>