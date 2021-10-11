<template>
  <div id = "available_counsellor_preview_box"> 
      <h5> Mr John Tan </h5>
      ★★★☆☆ <br>
      Career <br><br>
      <!-- <button id = "consult_now" @click="goToRoom"> Consult Now </button>  -->
      <button><router-link to="/dailyUserView">Consult Now</router-link></button>

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
  width: 30%;
  background-color: white;
}
#consult_now {
  background-color: blueviolet;
  color: white;
}
</style>