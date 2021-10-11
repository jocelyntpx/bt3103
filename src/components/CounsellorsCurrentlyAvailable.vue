<template>
  <div id = "available_counsellor_preview_box"> 
     <h5><router-link to="/counsellorProfile">Mr John Tan</router-link></h5>
      ★★★☆☆ <br>
      Career <br><br>
      <!-- <button id = "consult_now" @click="goToRoom"> Consult Now </button>  -->
      <button id = "consult_now"><router-link to="/dailyUserView">Consult Now</router-link></button>

  </div>
</template>

<script>
// import router from './router/index.js'

export default {
  name: "CounsellorsCurrentlyAvailable",
  // components: {router},
  data() {

  },
  methods: {
    // goToRoom() {
    //   router.push("sessionRoom");
    // }
  }
}
</script>

<style scoped>
#available_counsellor_preview_box {
  padding: 5px;
  width: 35%;
  height: 180px;
  background-color: white;
}
#consult_now {
  background-color: yellow;
  color: white;
}
</style>