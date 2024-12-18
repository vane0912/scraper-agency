<template>
    <div class="flex flex-col">
        <h2 class="mb-2">{{ title_input }}</h2>
        <input 
        class="w-full h-9 p-2 text-start bg-background-white rounded-lg"
        :type="inputType"
        v-model="model"
        >
    </div>   
</template>

<script setup>
    import { defineProps, defineModel } from 'vue';
    const model = defineModel()
    defineProps(['inputType', 'title_input'])
</script>