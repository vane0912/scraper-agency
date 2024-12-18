<template>
    <button
    class="bg-orange-agency w-full text-background-white font-bold text-xl rounded-3xl p-2"
    @click="$emit('new_event')"
    >{{ btnText }}</button>
</template>
<script setup>
import { defineProps, defineEmits} from 'vue';

defineEmits(['new_event'])
defineProps(['btnText'])
</script>