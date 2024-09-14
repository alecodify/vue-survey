<script setup>
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useStore } from 'vuex';

    const route = useRoute();
    const store = useStore();

    const loading = computed(() => store.state.surveyResults.loading);
    const results = computed(() => store.state.surveyResults.data.Results);
    const surveyTitle = computed(() => store.state.surveyResults.data.surveyTitle);
    const totalResponses = computed(() => store.state.surveyResults.data.totalResponses);

    store.dispatch('getSurveyResults', route.params.id);

</script>

<template>
        <div v-if="loading" class="flex justify-center items-center h-screen">
          <div class="text-xl font-semibold">Loading...</div>
        </div>
        
        <div v-else>
            <h2 class="text-2xl font-bold mb-6 text-center">{{ surveyTitle }}</h2>
            <p class="text-center mb-6">Total Responses: {{ totalResponses - 1 }}</p>
            <div v-for="result in results" :key="result.email" class="bg-white shadow-md rounded-lg p-6 mb-6 mx-5 md:mx-20">
              <h3 class="text-xl font-semibold mb-2 uppercase">{{ result.user }}</h3>
              <p class="text-gray-700 mb-2"><span class="font-semibold">Email:</span> {{ result.email }}</p>
              <p class="text-gray-700 mb-2"><span class="font-semibold">Correct Answers:</span> {{ result.correctAnswers }}</p>
              <p class="text-gray-700 mb-2"><span class="font-semibold">Wrong Answers:</span> {{ result.wrongAnswers }}</p>
              <p class="text-gray-700 mb-2"><span class="font-semibold">Total Questions:</span> {{ result.totalQuestions }}</p>
              <p class="text-gray-700 mb-4"><span class="font-semibold">Percentage:</span> {{ result.percentage }}%</p>
              <h4 class="text-lg font-semibold mb-2">Details:</h4>
              <ul class="list-disc pl-5 space-y-2">
                <li v-for="(match, index) in result.matchResults" :key="index" class="text-gray-600">
                  <p><span class="font-semibold">Question:</span> {{ match.question }}</p>
                  <p><span class="font-semibold">Your Answer:</span> {{ match.userAnswer }}</p>
                  <p><span class="font-semibold">Correct Answer:</span> {{ match.adminAnswer }}</p>
                  <p><span class="font-semibold">Match:</span> <span :class="{'text-green-500': match.isMatch, 'text-red-500': !match.isMatch}">{{ match.isMatch ? 'Yes' : 'No' }}</span></p>
                </li>
              </ul>
            </div>
          </div>
  </template>