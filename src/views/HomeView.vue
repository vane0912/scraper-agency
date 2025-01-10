<template>
  <div :class="[searching ? 'flex' : 'hidden']" 
      class="inset-0 absolute items-center justify-center w-full h-full z-10 bg-background-white/50">
      <div class="flex justify-center items-center flex-col">
          <h2 class="mb-5">Buscando...</h2>
          <div class="w-10 h-10 border-x-2 border-b-2 border-t-2 border-t-background-white rounded-full animate-spin border-orange-agency"></div>
      </div>
  </div>
  <div :class="[copy_arr.length > 0 ? 'hidden' : 'grid']" class="grid-cols-12 gap-5 w-full px-20 py-12">
      <div
       class="bg-agency-blue/10 col-span-full rounded-lg gap-7 grid grid-cols-12 p-8">
          <InputField
              title_input="Destino"
              class="col-start-1 col-end-4"
              v-model="search_details.destiny"
          />
          <InputField
              title_input="Check in"
              class="col-start-4 col-end-7"
              v-model="search_details.checkin"
              input-type="date"
          />
          <InputField
              title_input="Check out"
              class="col-start-7 col-end-10"
              v-model="search_details.checkout"
              input-type="date"
          />
          <InputField
              class="col-start-10 col-end-13"
              title_input="Habitaciones"
              input-type="number"
              v-model="search_details.room_numbers"
          />
          <div :class="{'hidden': ready_to_search}" class="col-start-10 col-end-13">
              <ButtonGeneral
              @new_event="add_rooms()"
              btn-text="Agregar Habitaciones"/>
          </div>
          <div v-if="ready_to_search" :class="{'col-start-10 col-end-13': ready_to_search}">
              <ButtonGeneral
              @new_event="run_scraper()"
              btn-text="Buscar"/>
          </div>
      </div>
      <div v-for="(room,index) in search_details.rooms_details" 
          :key="index" 
          class="w-full h-fit my-8 px-14 py-6 col-span-4 bg-background-white border rounded-lg border-agency-blue">
          <h2>Habitacion {{ index + 1 }}</h2>
          <div class="w-full flex justify-between my-4">
              <div>
                  <h3 class="mb-2">Adultos</h3>
                  <input 
                  v-model="search_details.rooms_details[index].adults"
                  class="rounded-lg border px-3 border-orange-agency w-32 h-9" type="number">
              </div>
              <div>
                  <h3 class="mb-2">Niños</h3>
                  <input
                  v-model="search_details.rooms_details[index].kids"
                  class="rounded-lg border px-3 border-orange-agency w-32 h-9" type="number">
              </div>
          </div>
          <div class="mt-4" v-if="search_details.rooms_details[index].kids">
              <h3 class="mb-2">Edades de Niños</h3>
              <div :id="'room_kids.' + search_details.rooms_details[index].room" class="w-full flex justify-between flex-wrap">
                  <input
                  v-for="(kid, index) in search_details.rooms_details[index].kids"
                  :key="index" type="number" 
                  class="rounded-lg border px-3 border-orange-agency w-32 mb-3 h-9">
              </div>
          </div>
      </div>
  </div>
  <div class="grid grid-cols-12 gap-7 col-span-full h-full justify-between px-20 py-12">
      <div :class="[unique_results.operadoras.length > 0 ? 'col-span-3' : 'hidden']"
      class="col-span-3 w-full relative h-fit border rounded-lg mb-12 py-3 px-5 border-agency-blue">
          <h4>Operadora</h4>
          <div class="h-fit w-full flex flex-wrap my-2 justify-between">
              <div v-for="(operadora,index) in unique_results.operadoras" :key="index">
                  <input class="w-4 h-4" type="checkbox" v-model="filter.operadoras" :value="operadora">
                  <label class="ml-2">{{ operadora }}</label>
              </div>
              <div>
                  <input class="w-4 h-4" type="checkbox" :value="unique_results.operadoras" v-model="filter.operadoras">
                  <label class="ml-2">Ver todas</label>
              </div>
          </div>
          <div>
              <h4>Precio</h4>
              <select v-model="sort_prices" class="w-full bg-background-white border border-orange-agency p-2 rounded my-2">
                  <option value="Mayor">Mayor a Menor</option>
                  <option value="Menor">Menor a Mayor</option>
              </select>
          </div>
          <h4>Calificacion</h4>
          <div class="h-fit w-full flex flex-wrap my-2 justify-between">
              <div v-for="(score,index) in unique_results.score" :key="index">
                  <input class="w-4 h-4" type="checkbox"  v-model="filter.score" :value="score">
                  <label class="ml-2">{{ score }} estrellas</label>
              </div>
              <div >
                  <input class="w-4 h-4" :value="unique_results.score" v-model="filter.score" type="checkbox">
                  <label class="ml-2" >Ver todas</label>
              </div>
          </div>
          <h4>Nombre Hotel</h4>
          <div class="my-2">
              <input class="w-full bg-background-white border border-orange-agency p-2 rounded my-2" v-model="hotel_title">
          </div>
          <h4>Tipo</h4>
          <div class="my-2">
              <div v-for="(hotel_details,index) in unique_results.hotel_details" :key="index" class="my-2">
                  <input class="w-4 h-4" type="checkbox" v-model="filter.hotel_details" :value="hotel_details">
                  <label class="ml-2">{{ hotel_details }}</label>
              </div>
              <div>
                  <input class="w-4 h-4" type="checkbox" :value="unique_results.hotel_details" v-model="filter.hotel_details">
                  <label class="ml-2">Ver todas</label>
              </div>
          </div>
          <h4>Cancelacion</h4>
              <div class="my-2">
                  <div v-for="(cancelacion,index) in unique_results.cancelacion" :key="index" class="my-2">
                  <input class="w-4 h-4" type="checkbox" v-model="filter.cancelacion" :value="cancelacion">
                  <label class="ml-2">{{ cancelacion }}</label>
              </div>
              <div>
                  <input class="w-4 h-4" type="checkbox" :value="unique_results.cancelacion" v-model="filter.cancelacion">
                  <label class="ml-2">Ver todas</label>
              </div>
          </div>
      </div>
      <div class="col-start-4 col-end-13 w-full">
          <div :class="[still_searching && !searching ? 'flex' : 'hidden']" class="w-full mb-3 items-center">
              <div class="w-5 h-5 border-x-2 border-b-2 border-t-2 border-t-background-white rounded-full animate-spin border-orange-agency"></div>
              <h3 class="mx-3">Buscando en operadoras</h3>
          </div> 
          <div :key="index" v-for="(operadora, index) in error_operadoras">
              <h3 class="mb-4">Error buscando en {{ operadora }}</h3>
          </div>
          <div v-for="(room, index) in results_arr"
          :key="index">
              <HotelListing
                  :room="room"
              />
          </div>
      </div>
  </div>
</template>

<script setup>
import ButtonGeneral from '@/components/ButtonGeneral.vue';
import HotelListing from '@/components/HotelListing.vue';
import InputField from '@/components/InputField.vue';
import socket from '@/socket'
import {reactive, ref, watch} from 'vue';

const search_details = ref({
destiny: '',
checkin: '',
checkout: '',
room_numbers: 1,
rooms_details: []
});
const error_operadoras = ref([])
const ready_to_search = ref(false);
const searching = ref(false)
const unique_results = reactive({operadoras: [], score: [], hotel_details: [], cancelacion: []})
const filter = reactive({operadoras: [], score: [], hotel_details: [],cancelacion: []})
const hotel_title = ref("")
const sort_prices = ref('')

const results_arr = ref([])
const still_searching = ref(false)
const copy_arr = []

watch(
  () => [filter.operadoras, filter.score, filter.hotel_details, filter.cancelacion, hotel_title.value, sort_prices.value], 
  ([operadora, score, details, cancelacion]) =>{
  results_arr.value = copy_arr
  if (operadora.length === 0) filter.operadoras = unique_results.operadoras;
  if (score.length === 0) filter.score = unique_results.score;
  if (details.length === 0) filter.hotel_details = unique_results.hotel_details;
  if (cancelacion.length === 0) filter.cancelacion = unique_results.cancelacion;

  if (operadora.length || score.length || details.length || cancelacion.length || hotel_title.value.length > 0) {
      filter_by();
  }
}) 
function filter_by(){
  const extractPrice = (priceString) => parseFloat(priceString.replace(/[^0-9.-]+/g, '').replace(',', ''));
  const general_filter = results_arr.value.filter(function (el){
      return filter.operadoras.includes(el.operadora) &&
             filter.score.includes(el.score) &&
             filter.hotel_details.includes(el.hotel_details) &&
             filter.cancelacion.includes(el.cancelacion)
  })
  if(hotel_title.value.length > 0){
      console.log(sort_prices.value)
      const filter_by_title = general_filter.filter(el => el.hotel_title.toLowerCase().includes(hotel_title.value.toLowerCase()))
      const final_filter = sort_prices.value == "Mayor" ? filter_by_title.sort((a, b) => extractPrice(b.price) - extractPrice(a.price)) : filter_by_title.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
      return results_arr.value = final_filter
  }else{
      const final_filter = sort_prices.value == "Mayor" ? general_filter.sort((a, b) => extractPrice(b.price) - extractPrice(a.price)) : general_filter.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
      return results_arr.value = final_filter
  }
}

function add_rooms(){
  for(let i = 0; i < search_details.value.room_numbers; i++){
      search_details.value.rooms_details.push({adults: 0, kids: 0, room: i, ages:[]})
  }
  ready_to_search.value = true
}
async function run_scraper(){
  searching.value = true
  search_details.value.rooms_details.forEach((roomDetail, roomIndex) => {
      const kidsWrapper = document.getElementById(`room_kids.${roomIndex}`);
      
      if (kidsWrapper !== null) {
        const kidsAgesInputs = Array.from(kidsWrapper.getElementsByTagName('input'));
        roomDetail.ages = kidsAgesInputs.map(input => input.value); 
      }
  });

  socket.emit('message', JSON.stringify(search_details.value))
  
  socket.on('message', (event) => {
    still_searching.value = true
    searching.value = false
    console.log(event)
    if(event.Error){
        error_operadoras.value.push(event.Error)
        console.log(error_operadoras)
    }else{
        copy_arr.push(...event)
        results_arr.value.push(...event)
    }
  })
  socket.on('disconnect', () =>{
    still_searching.value = false
      const uniqueOperadoras = [...new Set(results_arr.value.map(item => item.operadora))];
      const uniqueScores = [...new Set(results_arr.value.map(item => item.score))];
      const uniquedetails = [...new Set(results_arr.value.map(item => item.hotel_details))];
      const uniqueCancelacion = [...new Set(results_arr.value.map(item => item.cancelacion))]

      unique_results.operadoras.push(...uniqueOperadoras)
      unique_results.score.push(...uniqueScores)
      unique_results.hotel_details.push(...uniquedetails)
      unique_results.cancelacion.push(...uniqueCancelacion)
      
      filter.operadoras.push(...uniqueOperadoras)
      filter.score.push(...uniqueScores)
      filter.hotel_details.push(...uniquedetails)
      filter.cancelacion.push(...uniqueCancelacion)
      console.log('Connection Closed')
  })
}
</script>
