<script setup>
    import { computed, ref, watchEffect } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import QuestionViewer from '@/components/QuestionViewer.vue';
    import Notification from '@/components/Notification.vue';

    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const loading = computed(() => store.state.currentSurvey.loading);
    const survey = computed(() => store.state.currentSurvey.data);
    const user = computed(() => store.state.user.data);

    const surveyFinished = ref(false);

    const answers = ref({});

    store.dispatch('getSurvey', route.params.slug);
    store.dispatch('getUser');

    function submitSurvey() {
        console.log(JSON.stringify(answers.value, undefined, 2));
        store.dispatch("saveSurveyAnswer", { surveyId: survey.value._id, answers: answers.value, }).then((response) => {
            if (response.data.status === 'Success') {
                surveyFinished.value = true;
                store.commit("notify", { type: "success", message: "The survey was successfully submitted." });
                router.push({ name: "Surveys" });
            }
        }).catch((error) => {
            if (error.response.data.status === 'AlreadySubmitted') {
                store.commit("notify", { type: "warning", message: "You have already submitted a response for this survey." });
            } else {
                store.commit("notify", { type: "error", message: "An error occurred while submitting the survey." });
            }
        });
    }

    function MovetoSuverys() {
        router.push({ name: 'Surveys' });
    }

    function navigateToLogin() {
        router.push({ name: 'Login' });
    }

    function navigateToRegister() {
        router.push({ name: 'Register' });
    }

    const isExpired = computed(() => {
        if (!survey.value.expireDate) return false;
        const expireDate = new Date(survey.value.expireDate);
        return expireDate < new Date();
    });

    watchEffect(() => {
        if (isExpired.value) {
            router.push({ name: 'FourOhFour', query: { message: 'This survey has expired.' }});
        }
    });
</script>

<template>
    <div class="">
        <div v-if="loading" class="flex justify-center">Loading...</div>
        
        <div v-else>
            <form v-if="user.email && !isExpired" @submit.prevent="submitSurvey" class="container mx-auto py-5 px-10">
                <div class="grid grid-cols-6 items-center">
                    <div class="mr-4"><img :src="survey.image" alt="" ></div> 
                    <div class="col-span-5">
                        <h1 class="text-3xl mb-3">{{ survey.title }}</h1>
                        <p class="text-gray-500 text-sm" v-html="survey.description"></p>
                    </div>
                </div>

                <div v-if="surveyFinished" class="py-8 px-6 bg-emerald-400 flex flex-col justify-center items-center text-white w-[600px] mx-auto">
                    <div class="text-xl mb-3 font-semibold">Thank you for participating in this survey.</div>
                    <button @click="MovetoSuverys" type="button" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Back to Surveys</button>
                </div>

                <div v-else>
                    <hr class="my-3">
                    <div v-for="(question, index) of survey.questions" :key="question._id">
                        <QuestionViewer v-model="answers[question._id]" :question="question" :index="index" />
                    </div>
                    <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                </div>
            </form>

            <div v-else-if="!user.email" class="flex flex-col justify-center items-center h-screen bg-gray-100">
                <div class="bg-white p-8 text-center rounded-lg shadow-lg max-w-lg w-full">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Please LogIn or Register to Continue</h2>
                    <p class="text-lg text-gray-600 mb-6">Currently, you are browsing as a guest.</p>
                    <div class="flex flex-col md:flex-row justify-center items-center md:space-x-4">
                        <button @click="navigateToLogin" class="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-3 md:mb-0">
                            LogIn
                        </button>
                        <button @click="navigateToRegister" class="inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Notification />
    </div>
</template>