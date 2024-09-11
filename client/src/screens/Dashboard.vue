<script setup>
    import Card from '@/components/Card.vue';
    import PageComponent from '@/components/PageComponent.vue';
    import { computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore();

    const loading = computed(() => store.state.dashboard.loading);
    const data = computed(() => store.state.dashboard.data);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return date.toLocaleDateString(undefined, options);
    };



    store.dispatch('getDashboardData');
</script>

<template>
    <PageComponent title="Dashboard">
        <div v-if="loading" class="flex justify-center">Loading...</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
            <Card class="order-1 lg:order-2" style="animation-delay: 0.1s">
                <template v-slot:title>Total Surveys</template>
                <div class="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                    {{ data.totalSurveys }}
                </div>
            </Card>

            <Card class="order-2 lg:order-4" style="animation-delay: 0.2s">
                <template v-slot:title>Total Answers</template>
                <div class="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                    {{ data.totalAnswers }}
                </div>
            </Card>

            <Card class="order-3 lg:order-1 row-span-2" style="animation-delay: 0.2s">
                <template v-slot:title>Latest Survey</template>
                <div v-if="data.latestSurvey">
                    <img :src="data.latestSurvey.image" class="w-[340px] mx-auto" alt="" />
                    <h3 class="font-bold text-xl mb-3">{{ data.latestSurvey.title }}</h3>
                    <div class="flex justify-between text-sm mb-1">
                        <div>Create Date:</div>
                        <div>{{ formatDate(data.latestSurvey.createdAt) }}</div>
                    </div>
                    <div class="flex justify-between text-sm mb-1">
                        <div>Expire Date:</div>
                        <div>{{ formatDate(data.latestSurvey.expireDate) }}</div>
                    </div>
                    <div class="flex justify-between text-sm mb-1">
                        <div>Status:</div>
                        <div>{{ data.latestSurvey.isActive ? "Active" : "Draft" }}</div>
                    </div>
                    <!-- <div class="flex justify-between text-sm mb-1">
                        <div>Questions:</div>
                        <div>{{ data.latestSurvey.questions }}</div>
                    </div>
                    <div class="flex justify-between text-sm mb-3">
                        <div>Answers:</div>
                        <div>{{ data.latestSurvey.answers }}</div>
                    </div> -->
                    <div class="flex justify-between">
                        <Button :to="{ name: 'SurveyView', params: { id: data.latestSurvey.id } }" link>
                            <i class="pi pi-pencil text-sm"></i>
                            Edit Survey
                        </Button>

                        <Button link>
                            <i class="pi pi-eye text-sm"></i>
                            View Answers
                        </Button>
                    </div>
                </div>
                <div v-else class="text-gray-600 text-center py-16">
                    Your don't have surveys yet
                </div>
            </Card>

            <Card class="order-4 lg:order-3 row-span-2" style="animation-delay: 0.3s">
                <template v-slot:title>
                    <div class="flex justify-between items-center mb-3 px-2">
                        <h3 class="text-2xl font-semibold">Latest Answers</h3>

                        <a href="javascript:void(0)" class="text-sm text-blue-500 hover:decoration-blue-500">
                            View all
                        </a>
                    </div>
                </template>

                <div v-if="data.latestAnswers?.length" class="text-left">
                    <a href="#" v-for="answer of data.latestAnswers" :key="answer.id"
                        class="block p-2 hover:bg-gray-100/90">
                        <div class="font-semibold">{{ answer.survey.title }}</div>
                        <small>
                            Answer Made at:
                            <i class="font-semibold">{{ answer.end_date }}</i>
                        </small>
                    </a>
                </div>
                <div v-else class="text-gray-600 text-center py-16">
                    Your don't have answers yet
                </div>
            </Card>


        </div>
    </PageComponent>
</template>