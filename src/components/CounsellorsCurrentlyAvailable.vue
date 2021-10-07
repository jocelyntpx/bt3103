<template>
  <div id = "available_counsellor_preview_box"> 
      <h5> FULL NAME </h5>
      RATING (in stars) <br>
      CATEGORIES <br>
      <button id = "consult_now" @click="goToRoom"> Consult Now </button> 
  </div>
</template>

<script>
export default {
  name: "CounsellorsCurrentlyAvailable",
  data() {

  },
  methods: {
    goToRoom() {

    }
  }
}
</script>

<style scoped>
#available_counsellor_preview_box {
  background-color: aliceblue;
  /* width: 30%; */
}
#consult_now {
  background-color: blue;
  color: white;
}
</style>