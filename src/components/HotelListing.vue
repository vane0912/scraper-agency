<template>
    <div class="w-full relative flex border rounded-lg max-h-52 mb-12 border-agency-blue/10">
        <div class="w-2/5 max-h-full rounded-lg">
            <img class="w-full h-full rounded-lg" :src="room.img_hotel">
        </div>
        <div class="p-4 w-full">
            <div class="w-full flex justify-between">
                <h2>{{ room.hotel_title }}</h2>
                <div class="flex">
                    <img v-for="(score, index) in room.score" :key="index" 
                        src="../assets/estrella.png" 
                        alt="rating" 
                        class="w-5 h-5">
                </div>
            </div>
            <div class="my-4">
                <h3>{{ room.operadora }}</h3>
                <h4>Tipo de hotel: {{ room.hotel_details }}</h4>
                <h4>Cancelacion: {{ room.cancelacion }}</h4>
            </div>
            <div class="bg-agency-blue/10 absolute bottom-0 px-8 py-2 rounded-lg right-0">
                <h3>{{ room.price }}</h3>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps} from 'vue';
defineProps({
    'room': Object
})
</script>