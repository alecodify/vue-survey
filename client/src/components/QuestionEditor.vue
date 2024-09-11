<script setup>
    import { v4 as uuidv4 } from 'uuid';
    import { computed, ref } from 'vue';
    import store from '@/store';

    const props = defineProps({
        question: Object,
        index: Number,
    });

    const emit = defineEmits(['change', 'addQuestion', 'deleteQuestion']);

    const model = ref(JSON.parse(JSON.stringify(props.question)));

    const questionTypes = computed(() => store.state.questionTypes);

    function upperCaseFirst(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getOptions(){
        return model.value.options;
    }

    function setOptions(options){
        model.value.options = options;
    }

    function shouldHaveOptions(){
        return ['select', 'radio', 'checkbox'].includes(model.value.type);
    }

    function addOption(){
        setOptions([...getOptions(), { uuid: uuidv4(), text: '' }]),
        dataChange();
    }

    function removeOption(op){
        setOptions(getOptions().filter((opt) => opt !== op));
        dataChange();
    }

    function typeChange(){
        if (shouldHaveOptions()) {
            setOptions(getOptions() || []);
        }
        dataChange();
    }

    function dataChange(){
        const data = model.value;
        if (!shouldHaveOptions()) {
            delete data.options;
        }

        emit('change', data);
    }

    function addQuestion(){
        emit('addQuestion', props.index + 1);
    }

    function deleteQuestion(){
        emit('deleteQuestion', props.question);
    }
</script>

<template>
    <div class="flex items-center justify-between">
        <h3>{{ index + 1 }}. {{ model.question }}</h3>

        <div class="flex items-center">
            <button type="button" @click="addQuestion()" class="flex items-center text-xs py-1 px-3 mr-2 rounded-sm text-white bg-gray-600 hover:bg-gray-700">
                <i class="pi pi-plus text-white mr-1"></i>
                Add
            </button>

            <button type="button" @click="deleteQuestion()" class="flex items-center text-xs py-1 px-3 mr-2 rounded-sm border border-transparent text-red-500 border-red-600">
                <i class="pi pi-plus mr-1"></i>
                Delete
            </button>
        </div>
    </div>

    <div class="grid gap-3 grid-cols-12">
        <div class="mt-3 col-span-9">
            <label :for="'question_text_' + model.data" class="block text-sm font-medium text-gray-700">Question Text</label>
            <input type="text" :name="'question_text_' + model.data" v-model="model.question" @change="dataChange" :id="'question_text_' + model.data" class="mt-1 py-1 px-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
        </div>

        <div class="mt-3 col-span-3">
            <label for="question_type" class="block text-xs md:text-sm font-medium text-gray-700">Select Question Type</label>
            <select id="question_type" name="question_type" v-model="model.type" @change="typeChange" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm text-xs md:text-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option v-for="type in questionTypes" :key="type" :value="type">
                    {{ upperCaseFirst(type) }}
                </option>
            </select>
        </div>
    </div>

    <div class="mt-3 col-span-9">
        <label :for="'question_description_' + model.id" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea :name="'question_description_' + model.id" :id="'question_description_' + model.id" @change="dataChange" v-model="model.description"
            class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
    </div>

    <div>
        <div v-if="shouldHaveOptions()" class="mt-2">
            <h4 class="text-sm font-semibold mb-1 flex justify-between items-center">Options
                <button type="button" @click="addOption()" class="flex items-center text-xs py-1 px-2 rounded-sm text-white bg-gray-600 hover:bg-gray-700">
                    <i class="pi pi-plus mr-2 text-white"></i>
                    Add Option
                </button>
            </h4>

            <div v-if="!model.options?.length" class="text-xs text-gray-600 text-center py-3">
                You don't have any options defined
            </div>

            <div v-for="(option, index) in model.options" :key="option.uuid" class="flex items-center mb-1">
                <span class="w-6 text-sm">{{ index + 1}}. </span>
                <input type="text" tabindex="1" v-model="option.text" @change="dataChange" class="w-full rounded-sm py-1 px-2 text-xs border border-gray-300 focus:border-indigo-500">
                <button type="button" @click="removeOption(option)" class="h-6 w-6 rounded-full flex items-center justify-center border border-transparent text-red-500 transition-colors hover:border-red-100">
                    <i class="pi pi-times text-lg mr-1"></i>
                </button>
            </div>
        </div>
    </div>

    <hr class="my-4">
</template>