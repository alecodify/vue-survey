<script setup>
    import { v4 as uuidv4 } from 'uuid';
    import { computed, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import store from '@/store';
    import PageComponent from '@/components/PageComponent.vue';
    import QuestionEditor from '@/components/QuestionEditor.vue';
    import Button from '@/components/Button.vue';

    const router = useRouter();
    const route = useRoute();

    const surveyLoading = computed(() => store.state.currentSurvey.loading);

    let model = ref({
        title: "",
        status: false,
        description: null,
        image: null,
        imagePreview: null,
        expireDate: "",
        questions: [],
    });

    watch(() => store.state.currentSurvey.data, (newVal, oldVal) => {
        model.value = {
            ...JSON.parse(JSON.stringify(newVal)), 
            status: !!newVal.status, 
            expireDate: newVal.expireDate ? formatDateForInput(newVal.expireDate) : "",
            imagePreview: newVal.image ? newVal.image : null,
        }
    });

    if (route.params.id) {
        store.dispatch('getSurvey', route.params.id);
    }

    function onImageChoose(ev) {
        const file = ev.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            model.value.imagePreview = reader.result;
            model.value.image = file;
            ev.target.value = "";
        };
        reader.readAsDataURL(file);
    }

    function addQuestion(index) {
        const newQuestion = {
            id: uuidv4(),
            type: "text",
            question: "",
            description: null,
            data: {},
        };

        model.value.questions.splice(index, 0, newQuestion);
    }

    function deleteQuestion(question) {
        model.value.questions = model.value.questions.filter((q) => q !== question);
    }

    function questionChange(question) {
        if (question.data.options) {
            question.data.options = [...question.data.options];
        }
        model.value.questions = model.value.questions.map((q) => {
            if (q.id === question.id) {
              return JSON.parse(JSON.stringify(question));
            }

            return q;
        });
    }

    function handleSubmit() {
        if (route.params.id) {
            updateSurvey();
        } else {
            saveSurvey();
        }
    }

    function saveSurvey() {
        const payload = {
            ...model.value,
            expireDate: convertToISODate(model.value.expireDate),
        };
        store.dispatch("saveSurvey", payload).then((response) => {
            if (response.data.status === 'Success') {
                store.commit("notify", { type: "success",  message: "The survey was successfully "});
                router.push({ name: "Surveys" });
            } else {
                store.commit("notify", { type: "error",  message: "The survey does not save, something went wrong. "});
            }
        });
    }

    function updateSurvey() {
        const payload = {
            ...model.value,
            expireDate: convertToISODate(model.value.expireDate),
        };
        store.dispatch("updateSurvey", payload).then((response) => {
            if (response.data.status === 'Success') {
                store.commit("notify", { type: "success",  message: "The survey updated successfully " });
                router.push({ name: "Surveys" });
            } else {
                store.commit("notify", { type: "error",  message: "The survey does not update, something went wrong. "});
            }
        });
    }

    function deleteSurvey() {
        if (confirm(`Are you sure you want to delete this survey? Operation can't be undone!!`)) {
            store.dispatch("deleteSurvey", model.value._id).then(() => {
                router.push({ name: "Surveys" });
            });
        }
    }

    function formatDateForInput(isoDate) {
        const date = new Date(isoDate);
        return date.toISOString().split('T')[0];
    }

    function convertToISODate(dateString) {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day).toISOString();
    }

</script>

<template>
    <PageComponent>
        <template v-slot:header>
            <div class="flex items-center justify-between">
                <h1 class="text-3xl font-bold text-gray-900">{{ route.params.id ? model.title : "Create a Survey" }}</h1>
                
                <div class="flex">
                    <Button v-if="route.params.id" link :href="`/view/survey/${route.params.id}`" target="_blank" class="mr-2">
                        <i class="pi pi-external-link text-md mr-2 mt-1 text-blue-500"></i>
                        View Public Link
                    </Button>

                    <Button v-if="route.params.id" color="red" @click="deleteSurvey()">
                        <i class="pi pi-trash text-lg text-white mr-1"></i>
                        Delete
                    </Button>
                </div>
            </div>
        </template>

        <div v-if="surveyLoading" class="flex justify-center">Loading...</div>

        <form v-else @submit.prevent="handleSubmit" class="animate-fade-in-down" enctype="multipart/form-data">
            <div class="shadow sm:rounded-md sm:overflow-hidden">
                <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700"> Image </label>
                        <div class="mt-1 flex items-center">
                          <img v-if="model.imagePreview" :src="model.imagePreview" :alt="model.title" class="w-64 h-48 object-cover" />
                          <span v-else class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100" >
                            <i class="pi pi-image text-xl text-gray-500 "></i>
                          </span>
                          
                          <button type="button" class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                            <input type="file" @change="onImageChoose" name="image" class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer" />
                            Change
                          </button>
                        </div>
                    </div>

                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700" >Title</label>
                        <input type="text" name="title" id="title" v-model="model.title" autocomplete="survey_title" class="mt-1 border-2 py-1 px-2 block w-full outline-none shadow-sm sm:text-sm border-gray-300 rounded-md" />
                    </div>

                    <div>
                        <label for="about" class="block text-sm font-medium text-gray-700">Description </label>
                        <div class="mt-1">
                          <textarea id="description" name="description" rows="3" v-model="model.description" autocomplete="survey_description" placeholder="Describe your survey"
                            class="shadow-sm  mt-1 block w-full sm:text-sm outline-none py-1 px-2 border-2 border-gray-300 rounded-md"
                          />
                        </div>
                    </div>

                    <div>
                        <label for="expire_date" class="block text-sm font-medium text-gray-700" >Expire Date</label>
                        <input type="date" name="expire_date" id="expire_date" v-model="model.expireDate"
                          class="mt-1 outline-none block w-full shadow-sm sm:text-sm border-2 bg-transparent py-1 px-2  border-gray-300 rounded-md"
                        />
                    </div>

                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                          <input id="status" name="status" type="checkbox" v-model="model.status"
                            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div class="ml-3 text-sm">
                          <label for="status" class="font-medium text-gray-700">Active</label>
                        </div>
                    </div>

                </div>

                <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <h3 class="text-2xl font-semibold flex items-center justify-between">
                      Questions
                      <button type="button" @click="addQuestion()" class="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700">
                        <i class="pi pi-plus text-md lg:text-sm font-bold mr-2"></i>
                        Add Question
                      </button>
                    </h3>

                    <div v-if="!model.questions.length" class="text-center text-gray-600"> You don't have any questions created </div>
                    <div v-for="(question, index) in model.questions" :key="question.id">
                      <QuestionEditor :question="question" :index="index" @change="questionChange" @addQuestion="addQuestion" @deleteQuestion="deleteQuestion" />
                    </div>
                  </div>

                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <Button>
                        <i class="pi pi-save text-sx mr-2 mt-1"></i>
                        {{ route.params.id ? "Update" : "Save" }}
                    </Button>
                </div>            
            </div>
        </form>
    </PageComponent>
</template>