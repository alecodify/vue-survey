<script setup>
    import Card from '@/components/Card.vue';
    import PageComponent from '@/components/PageComponent.vue';
    import Button from '@/components/Button.vue';
    import { computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore();

    const loading = computed(() => store.state.dashboard.loading);
    const data = computed(() => store.state.dashboard.data);
    const isAdmin = computed(() => store.state.user.isAdmin);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return date.toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

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
                    <div v-if="isAdmin" class="flex justify-between">
                        <Button :to="{ name: 'SurveyView', params: { id: data.latestSurvey._id } }" link>
                            <i class="pi pi-pencil text-sm mr-1 mt-1"></i>
                            Edit Survey
                        </Button>

                        <Button link>
                            <i class="pi pi-eye text-sm mr-1 mt-1"></i>
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
                    <div class="flex justify-center items-center mb-3 px-2">
                        <h3 class="text-2xl font-semibold">Latest Activity</h3>
                    </div>
                </template>

                <div v-if="data.surveyActivities?.length" class="text-left">
                    <div v-for="activity of data.surveyActivities" :key="activity._id" class="block p-2 hover:bg-gray-100/90">
                        <div class="font-semibold uppercase">{{ activity.title }}</div>
                        <div class="flex flex-col">
                            <span class="text-sm">
                                Survey Created At:
                                <i class="font-semibold">{{ formatDate(activity.createdAt) }} - {{ formatTime(activity.createdAt) }}</i>
                            </span>
                            <span class="text-sm">
                                Survey Expiration Date:
                                <i class="font-semibold">{{ formatDate(activity.expireDate) }} - {{ formatTime(activity.expireDate) }}</i>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div v-else class="text-gray-600 text-center py-16">
                    Your don't have answers yet
                </div>
            </Card>


        </div>
    </PageComponent>
</template>